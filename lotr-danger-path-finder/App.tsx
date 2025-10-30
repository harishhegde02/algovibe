import React, { useState, useMemo } from 'react';
import ControlsPanel from './components/ControlsPanel';
import ResultsPanel from './components/ResultsPanel';
import Visualization from './components/Visualization';
import type { GraphData, QueryResult, HighlightData } from './types';
import { usePathFinder } from './hooks/usePathFinder';

const initialEdges = `1 2 5
1 3 10
2 4 3
2 5 8
3 6 12
3 7 4
5 8 7
5 9 1
7 10 15
7 11 2`;

const initialQueries = `4 6
8 11
9 10`;

const App: React.FC = () => {
    const [edges, setEdges] = useState<string>(initialEdges);
    const [queries, setQueries] = useState<string>(initialQueries);
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [results, setResults] = useState<QueryResult[]>([]);
    const [activeResultIndex, setActiveResultIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [initialMessage, setInitialMessage] = useState<string>('Your path results will appear here...');

    const { processInputs } = usePathFinder();

    const handleRun = () => {
        setIsLoading(true);
        setError('');
        setInitialMessage('Building tree and processing paths...');

        // Allow UI to update before heavy computation
        setTimeout(() => {
            try {
                if (!edges.trim()) {
                    setInitialMessage('Please define your map (edges) first.');
                    setResults([]);
                    setGraphData({ nodes: [], links: [] });
                    setActiveResultIndex(null);
                    setIsLoading(false);
                    return;
                }
                const { graphData: newGraphData, results: newResults } = processInputs(edges, queries);
                setGraphData(newGraphData);
                setResults(newResults);

                if (newResults.length > 0) {
                    const firstValidIndex = newResults.findIndex(r => !r.error);
                    setActiveResultIndex(firstValidIndex !== -1 ? firstValidIndex : null);
                    setInitialMessage('Your path results will appear here...');
                } else if (!queries.trim()) {
                    setActiveResultIndex(null);
                    setInitialMessage('Enter some queries to see results.');
                } else {
                    setActiveResultIndex(null);
                }

            } catch (e) {
                const err = e as Error;
                setError(`Error: ${err.message}`);
                console.error("Error processing:", e);
                setInitialMessage(`Error: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        }, 50);
    };

    const highlightData: HighlightData | null = useMemo(() => {
        if (activeResultIndex !== null && results[activeResultIndex] && !results[activeResultIndex].error) {
            const activeResult = results[activeResultIndex];
            return {
                pathEdges: activeResult.pathEdges,
                maxDangerEdge: activeResult.maxDangerEdge,
            };
        }
        return null;
    }, [activeResultIndex, results]);
    
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white" style={{ filter: 'drop-shadow(0 0 5px #f59e0b)' }}>LOTR Danger Path Finder</h1>
                    <p className="text-lg text-stone-400">Find the scariest segment on your journey through Middle-earth.</p>
                </header>
                
                {error && (
                    <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-md relative mb-6" role="alert">
                        <strong className="font-bold">An error occurred: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                        <ControlsPanel
                            edges={edges}
                            onEdgesChange={setEdges}
                            queries={queries}
                            onQueriesChange={setQueries}
                            onRun={handleRun}
                            isLoading={isLoading}
                        />
                        <ResultsPanel
                            results={results}
                            activeResultIndex={activeResultIndex}
                            onResultClick={setActiveResultIndex}
                            initialMessage={initialMessage}
                        />
                    </div>
                    
                    <Visualization
                        graphData={graphData}
                        highlightData={highlightData}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;