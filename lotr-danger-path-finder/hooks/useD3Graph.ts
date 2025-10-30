
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { D3Node, D3Link, GraphData, HighlightData } from '../types';

export function useD3Graph(
    graphData: GraphData, 
    highlightData: HighlightData | null
) {
    const ref = useRef<HTMLDivElement>(null);
    const svgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);
    const simulationRef = useRef<d3.Simulation<D3Node, D3Link> | null>(null);

    // Initialization effect
    useEffect(() => {
        if (!ref.current) return;
        const container = ref.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const svg = d3.select(container).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", [-width / 2, -height / 2, width, height]);

        svgRef.current = svg;

        const linkG = svg.append("g").attr("class", "links");
        const labelG = svg.append("g").attr("class", "labels");
        const nodeG = svg.append("g").attr("class", "nodes");
        
        const simulation = d3.forceSimulation<D3Node, D3Link>()
            .force("link", d3.forceLink<D3Node, D3Link>().id(d => d.id).distance(100).strength(0.5))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(0, 0));

        simulationRef.current = simulation;

        const ticked = () => {
            // FIX: Cast 'd' to 'any' to access 'source' and 'target' properties, which exist on the datum after the simulation runs.
            linkG.selectAll("line")
                .attr("x1", d => ((d as any).source as D3Node).x!)
                .attr("y1", d => ((d as any).source as D3Node).y!)
                .attr("x2", d => ((d as any).target as D3Node).x!)
                .attr("y2", d => ((d as any).target as D3Node).y!);
            
            nodeG.selectAll("circle")
                .attr("cx", d => (d as D3Node).x!)
                .attr("cy", d => (d as D3Node).y!);
                
            labelG.selectAll(".node-label")
                .attr("x", d => (d as D3Node).x!)
                .attr("y", d => (d as D3Node).y! + 1);
                
            // FIX: Cast 'd' to 'any' to access 'source' and 'target' properties for calculating the midpoint.
            labelG.selectAll(".link-label")
                .attr("x", d => (((d as any).source as D3Node).x! + ((d as any).target as D3Node).x!) / 2)
                .attr("y", d => (((d as any).source as D3Node).y! + ((d as any).target as D3Node).y!) / 2);
        };

        simulation.on("tick", ticked);
        
        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            svg.attr("viewBox", [-width / 2, -height / 2, width, height]);
            simulation.force("center", d3.forceCenter(0, 0)).restart();
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            simulation.stop();
            d3.select(container).selectAll("*").remove();
        };
    }, []);

    // Data update effect
    useEffect(() => {
        if (!svgRef.current || !simulationRef.current) return;

        const svg = svgRef.current;
        const simulation = simulationRef.current;

        const linkG = svg.select<SVGGElement>(".links");
        const nodeG = svg.select<SVGGElement>(".nodes");
        const labelG = svg.select<SVGGElement>(".labels");
        
        const drag = (sim: typeof simulation) => {
            const dragstarted = (event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>) => {
                if (!event.active) sim.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            const dragged = (event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>) => {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            const dragended = (event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>) => {
                if (!event.active) sim.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
            return d3.drag<SVGCircleElement, D3Node>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
        
        // FIX: The key function must handle cases where d.source/d.target is a string (initial data) or a D3Node object (mutated data).
        const linkKeyFn = (d: D3Link) => `${(d.source as any).id || d.source}-${(d.target as any).id || d.target}`;

        const nodes = nodeG.selectAll<SVGCircleElement, D3Node>("circle")
            .data(graphData.nodes, d => d.id)
            .join("circle")
            .attr("r", 7)
            .attr("class", "node")
            .attr("id", d => `node-${d.id}`)
            .call(drag(simulation));

        const links = linkG.selectAll<SVGLineElement, D3Link>("line")
            .data(graphData.links, linkKeyFn)
            .join("line")
            .attr("class", "link")
            .attr("id", d => `edge-${(d.source as any).id || d.source}-${(d.target as any).id || d.target}`);

        const nodeLabels = labelG.selectAll<SVGTextElement, D3Node>(".node-label")
            .data(graphData.nodes, d => d.id)
            .join("text")
            .attr("class", "node-label")
            .text(d => d.id);

        const linkLabels = labelG.selectAll<SVGTextElement, D3Link>(".link-label")
            .data(graphData.links, linkKeyFn)
            .join("text")
            .attr("class", "link-label")
            .text(d => d.danger);
        
        simulation.nodes(graphData.nodes);
        simulation.force<d3.ForceLink<D3Node, D3Link>>("link")?.links(graphData.links);
        simulation.alpha(1).restart();

    }, [graphData]);

    // Highlight effect
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        svg.selectAll(".link").attr("class", "link");
        svg.selectAll(".node").attr("class", "node").attr("r", 7);

        if (!highlightData) return;

        const { pathEdges, maxDangerEdge } = highlightData;
        const pathNodeIds = new Set<string>();

        pathEdges.forEach(edge => {
            const { u, v } = edge;
            pathNodeIds.add(u.toString());
            pathNodeIds.add(v.toString());

            let link = svg.select(`#edge-${u}-${v}`);
            if (link.empty()) link = svg.select(`#edge-${v}-${u}`);
            link.classed("path", true);
        });

        pathNodeIds.forEach(id => {
            svg.select(`#node-${id}`).classed("path-node", true).attr("r", 8);
        });
        
        if (maxDangerEdge) {
            const { u, v } = maxDangerEdge;
            let link = svg.select(`#edge-${u}-${v}`);
            if (link.empty()) link = svg.select(`#edge-${v}-${u}`);
            link.classed("max-danger", true);
        }

    }, [highlightData]);

    return ref;
}
