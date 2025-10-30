import React from 'react';
import { MapIcon, FootprintsIcon, CompassIcon } from './Icons';

interface ControlsPanelProps {
    edges: string;
    onEdgesChange: (value: string) => void;
    queries: string;
    onQueriesChange: (value: string) => void;
    onRun: () => void;
    isLoading: boolean;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ edges, onEdgesChange, queries, onQueriesChange, onRun, isLoading }) => {
    return (
        <div className="bg-stone-900 border border-stone-700 p-6 rounded-lg shadow-lg flex flex-col gap-6" style={{ background: 'rgba(41, 26, 10, 0.8)', backdropFilter: 'blur(5px)' }}>
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
                    <MapIcon />
                    1. Define Your Map
                </h2>
                <p className="text-stone-400 mb-2 text-sm">Enter your `n-1` edges. Format: `u v w` (node1 node2 danger)</p>
                <textarea
                    value={edges}
                    onChange={(e) => onEdgesChange(e.target.value)}
                    className="w-full h-48 bg-stone-950 text-stone-200 p-3 rounded-md border border-stone-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                    placeholder={"1 2 5\n1 3 10\n2 4 3\n2 5 8\n3 6 12\n..."}
                    disabled={isLoading}
                />
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
                    <FootprintsIcon />
                    2. Plan Your Journeys
                </h2>
                <p className="text-stone-400 mb-2 text-sm">Enter your query paths. Format: `start end`</p>
                <textarea
                    value={queries}
                    onChange={(e) => onQueriesChange(e.target.value)}
                    className="w-full h-32 bg-stone-950 text-stone-200 p-3 rounded-md border border-stone-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                    placeholder={"4 6\n5 1\n..."}
                    disabled={isLoading}
                />
            </div>

            <button
                onClick={onRun}
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 mt-2 flex items-center justify-center gap-2 text-lg group disabled:bg-stone-600 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    <>
                        <CompassIcon />
                        Find Scariest Paths
                    </>
                )}
            </button>
        </div>
    );
};

export default ControlsPanel;