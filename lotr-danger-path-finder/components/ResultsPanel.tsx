import React from 'react';
import type { QueryResult } from '../types';
import { ScrollIcon } from './Icons';

interface ResultsPanelProps {
    results: QueryResult[];
    activeResultIndex: number | null;
    onResultClick: (index: number) => void;
    initialMessage: string;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, activeResultIndex, onResultClick, initialMessage }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mt-4 mb-4 text-white flex items-center gap-2">
                <ScrollIcon />
                3. Journey Results
            </h2>
            <div className="bg-stone-950 p-2 rounded-md border border-stone-700 h-48 overflow-y-auto flex flex-col gap-1">
                {results.length === 0 ? (
                    <p className="text-stone-500 p-2">{initialMessage}</p>
                ) : (
                    results.map((result, index) => (
                        <div
                            key={index}
                            className={`query-result p-2 ${activeResultIndex === index ? 'active' : ''}`}
                            onClick={() => onResultClick(index)}
                        >
                            {result.error ? (
                                <span className="text-red-400">{result.error}</span>
                            ) : (
                                <>
                                    <span className="text-stone-200">Path {result.u} &harr; {result.v}:</span>
                                    <span className="font-bold text-amber-400 ml-2">Max Danger = {result.maxDanger}</span>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ResultsPanel;