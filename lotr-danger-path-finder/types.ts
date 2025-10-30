
import type { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export interface D3Node extends SimulationNodeDatum {
  id: string;
}

export interface D3Link extends SimulationLinkDatum<D3Node> {
  source: string;
  target: string;
  danger: number;
}

export interface GraphData {
  nodes: D3Node[];
  links: D3Link[];
}

export interface PathEdge {
  u: number;
  v: number;
  danger: number;
}

export interface MaxDangerEdge {
  u: number;
  v: number;
}

export interface QueryResult {
  u: number;
  v: number;
  maxDanger: number;
  pathEdges: PathEdge[];
  maxDangerEdge: MaxDangerEdge | null;
  error?: string;
}

export interface HighlightData {
  pathEdges: PathEdge[];
  maxDangerEdge: MaxDangerEdge | null;
}
