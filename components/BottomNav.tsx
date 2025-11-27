import React from 'react';

interface BottomNavProps {
    currentView: 'kingdom' | 'skills';
    onNavigate: (view: 'kingdom' | 'skills') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
    return (
        <div className="bg-wood-900 border-t-4 border-wood-700 relative flex items-center h-14 shrink-0">
            <button
                onClick={() => onNavigate('kingdom')}
                className={`flex-1 h-full flex items-center justify-center text-parchment-100 transition-all ${currentView === 'kingdom' ? 'bg-wood-800 opacity-100' : 'opacity-50 hover:bg-wood-800/50 hover:opacity-80'}`}
                title="Reino"
            >
                <i className="fa-brands fa-fort-awesome text-2xl"></i>
            </button>

            <div className="w-px h-8 bg-wood-700/50"></div>

            <button
                onClick={() => onNavigate('skills')}
                className={`flex-1 h-full flex items-center justify-center text-parchment-100 transition-all ${currentView === 'skills' ? 'bg-wood-800 opacity-100' : 'opacity-50 hover:bg-wood-800/50 hover:opacity-80'}`}
                title="Habilidades"
            >
                <i className="fa-solid fa-tree text-2xl"></i>
            </button>
        </div>
    );
};

export default BottomNav;
