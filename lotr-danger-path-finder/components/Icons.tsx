
import React from 'react';

export const MapIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
);

export const FootprintsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10.5c.1.7.1 1.5.1 2.3c0 3.8-3.1 7-7 7s-7-3.1-7-7c0-3.3 2.3-6 5.3-6.8"></path>
        <path d="M10.1 7.8c.2-.2.4-.4.5-.6c1-2.2 3-3.6 5.3-3.8c-1.3.4-2.5 1.1-3.5 2.1c-1.2 1.3-2 3-2.3 4.8"></path>
        <path d="M15 2.1c.1.7.1 1.5.1 2.3c0 3.8-3.1 7-7 7s-7-3.1-7-7c0-3.3 2.3-6 5.3-6.8"></path>
        <path d="M5.1 7.8c.2-.2.4-.4.5-.6c1-2.2 3-3.6 5.3-3.8C9.6 4.1 8.4 4.8 7.4 5.9c-1.2 1.3-2 3-2.3 4.8"></path>
    </svg>
);

export const CompassIcon: React.FC = () => (
    <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-12">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>
);

export const ScrollIcon: React.FC = () => (
    <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"></path>
        <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"></path>
        <rect x="8" y="3" width="8" height="18" rx="2"></rect>
    </svg>
);
