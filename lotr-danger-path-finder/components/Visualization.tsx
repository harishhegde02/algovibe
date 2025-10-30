import React from 'react';
import type { GraphData, HighlightData } from '../types';
import { useD3Graph } from '../hooks/useD3Graph';

interface VisualizationProps {
    graphData: GraphData;
    highlightData: HighlightData | null;
}

const Visualization: React.FC<VisualizationProps> = ({ graphData, highlightData }) => {
    const d3ContainerRef = useD3Graph(graphData, highlightData);

    return (
        <div className="bg-stone-900 border border-stone-700 p-6 rounded-lg shadow-lg min-h-[600px] flex flex-col" style={{ background: 'rgba(41, 26, 10, 0.8)', backdropFilter: 'blur(5px)' }}>
            <h2 className="text-2xl font-semibold mb-4 text-white text-center">Middle-earth Map</h2>
            <div
                ref={d3ContainerRef}
                className="w-full flex-grow visualization-bg rounded-md border border-stone-700 relative overflow-hidden"
            >
                <div className="absolute top-2 left-2 p-3 bg-stone-900 bg-opacity-80 rounded-md text-xs border border-stone-700">
                    <div className="flex items-center mb-1">
                        <div className="w-4 h-1 bg-amber-500 mr-2 rounded" style={{ animation: "march-gold 1s linear infinite", backgroundSize: '10px 5px', backgroundImage: 'linear-gradient(45deg, #fde68a 25%, transparent 25%, transparent 50%, #fde68a 50%, #fde68a 75%, transparent 75%, transparent)' }}></div>
                        <span>Queried Path</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-1 bg-red-500 mr-2 rounded" style={{ animation: "pulse-red 1.5s ease-in-out infinite", boxShadow: '0 0 3px #ef4444' }}></div>
                        <span>Max Danger Segment</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Visualization;