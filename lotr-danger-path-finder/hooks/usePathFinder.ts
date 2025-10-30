
import { useCallback } from 'react';
import type { D3Node, D3Link, QueryResult, PathEdge, MaxDangerEdge } from '../types';

const MAX_NODES = 200005;
const LOGN = 20;

export function usePathFinder() {
    const processInputs = useCallback((edgesText: string, queriesText: string): { graphData: { nodes: D3Node[], links: D3Link[] }, results: QueryResult[] } => {
        let adj: { node: number, danger: number }[][];
        let depth: number[];
        let parent: number[][];
        let max_up: number[][];
        let edge_map: Map<string, number>;
        let nodeCount = 0;
        let visNodes: D3Node[] = [];
        let visLinks: D3Link[] = [];
        let allQueryData: QueryResult[] = [];

        // --- Helper Functions (ported from original JS) ---

        const dfs = (u: number, p: number, d: number, w: number) => {
            depth[u] = d;
            parent[u][0] = p;
            max_up[u][0] = w;
            for (const edge of adj[u]) {
                const v = edge.node;
                if (v !== p) {
                    dfs(v, u, d + 1, edge.danger);
                }
            }
        };

        const getLCA = (u: number, v: number): number => {
            if (depth[u] < depth[v]) [u, v] = [v, u];
            for (let j = LOGN - 1; j >= 0; j--) {
                if (depth[u] - (1 << j) >= depth[v]) {
                    u = parent[u][j];
                }
            }
            if (u === v) return u;
            for (let j = LOGN - 1; j >= 0; j--) {
                if (parent[u][j] !== 0 && parent[u][j] !== parent[v][j]) {
                    u = parent[u][j];
                    v = parent[v][j];
                }
            }
            return parent[u][0];
        };

        const getMaxDanger = (u: number, v: number): number => {
            let maxDanger = 0;
            if (depth[u] < depth[v]) [u, v] = [v, u];
            for (let j = LOGN - 1; j >= 0; j--) {
                if (depth[u] - (1 << j) >= depth[v]) {
                    maxDanger = Math.max(maxDanger, max_up[u][j]);
                    u = parent[u][j];
                }
            }
            if (u === v) return maxDanger;
            for (let j = LOGN - 1; j >= 0; j--) {
                if (parent[u][j] !== 0 && parent[u][j] !== parent[v][j]) {
                    maxDanger = Math.max(maxDanger, max_up[u][j], max_up[v][j]);
                    u = parent[u][j];
                    v = parent[v][j];
                }
            }
            maxDanger = Math.max(maxDanger, max_up[u][0], max_up[v][0]);
            return maxDanger;
        };

        const getPathAndMaxEdgeForVis = (u: number, v: number): { pathEdges: PathEdge[], maxDangerEdge: MaxDangerEdge | null } => {
            const lca = getLCA(u, v);
            let pathEdges: PathEdge[] = [];
            let maxDanger = -1;
            let maxDangerEdge: MaxDangerEdge | null = null;

            let curr = u;
            while (curr !== lca) {
                const p = parent[curr][0];
                const danger = edge_map.get(`${curr}-${p}`)!;
                pathEdges.push({ u: curr, v: p, danger });
                if (danger > maxDanger) {
                    maxDanger = danger;
                    maxDangerEdge = { u: curr, v: p };
                }
                curr = p;
            }

            curr = v;
            while (curr !== lca) {
                const p = parent[curr][0];
                const danger = edge_map.get(`${curr}-${p}`)!;
                pathEdges.push({ u: curr, v: p, danger });
                if (danger > maxDanger) {
                    maxDanger = danger;
                    maxDangerEdge = { u: curr, v: p };
                }
                curr = p;
            }
            return { pathEdges, maxDangerEdge };
        };

        // --- Main Processing Logic ---

        // 1. Parse Edges
        adj = Array(MAX_NODES).fill(null).map(() => []);
        depth = Array(MAX_NODES).fill(0);
        parent = Array(MAX_NODES).fill(null).map(() => Array(LOGN).fill(0));
        max_up = Array(MAX_NODES).fill(null).map(() => Array(LOGN).fill(0));
        edge_map = new Map();
        
        const nodeSet = new Set<number>();
        const edgeLines = edgesText.trim().split('\n');
        
        for (const line of edgeLines) {
            if (!line.trim()) continue;
            const parts = line.trim().split(/\s+/).map(Number);
            if (parts.length !== 3 || parts.some(isNaN)) {
                throw new Error(`Invalid edge format: "${line}"`);
            }
            const [u, v, w] = parts;
            adj[u].push({ node: v, danger: w });
            adj[v].push({ node: u, danger: w });
            nodeSet.add(u);
            nodeSet.add(v);
            visLinks.push({ source: u.toString(), target: v.toString(), danger: w });
            edge_map.set(`${u}-${v}`, w);
            edge_map.set(`${v}-${u}`, w);
        }

        if (nodeSet.size === 0) {
            return { graphData: { nodes: [], links: [] }, results: [] };
        }
        
        nodeCount = Math.max(...Array.from(nodeSet));
        for (let i = 1; i <= nodeCount; i++) {
            if (nodeSet.has(i)) {
                 visNodes.push({ id: i.toString() });
            }
        }
        
        // 2. Precomputation
        dfs(1, 0, 0, 0);
        for (let j = 1; j < LOGN; j++) {
            for (let i = 1; i <= nodeCount; i++) {
                const ancestor = parent[i][j - 1];
                if (ancestor !== 0) {
                    parent[i][j] = parent[ancestor][j - 1];
                    max_up[i][j] = Math.max(max_up[i][j - 1], max_up[ancestor][j - 1]);
                }
            }
        }

        // 3. Process Queries
        const queryLines = queriesText.trim().split('\n');
        if (!queriesText.trim()) {
            return { graphData: { nodes: visNodes, links: visLinks }, results: [] };
        }

        for(const line of queryLines) {
            if (!line.trim()) continue;
            const parts = line.trim().split(/\s+/).map(Number);
            if (parts.length !== 2 || parts.some(isNaN)) {
                allQueryData.push({ u: 0, v: 0, maxDanger: 0, pathEdges: [], maxDangerEdge: null, error: `Invalid query: "${line}"` });
                continue;
            }
            const [u, v] = parts;
            if (u > nodeCount || v > nodeCount || u <= 0 || v <= 0 || !nodeSet.has(u) || !nodeSet.has(v)) { 
                allQueryData.push({ u, v, maxDanger: 0, pathEdges: [], maxDangerEdge: null, error: `Query nodes out of bounds or do not exist: ${u}, ${v}` });
                continue;
            }

            const maxDanger = getMaxDanger(u, v);
            const { pathEdges, maxDangerEdge } = getPathAndMaxEdgeForVis(u, v);
            allQueryData.push({ u, v, maxDanger, pathEdges, maxDangerEdge });
        }
        
        return { graphData: { nodes: visNodes, links: visLinks }, results: allQueryData };
    }, []);

    return { processInputs };
}
