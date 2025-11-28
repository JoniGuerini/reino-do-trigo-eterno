import React from 'react';
import { FPSLimit } from '../App';

interface SettingsModalProps {
    show: boolean;
    onClose: () => void;
    showFPS: boolean;
    setShowFPS: (show: boolean) => void;
    fpsLimit: FPSLimit;
    setFpsLimit: (limit: React.SetStateAction<FPSLimit>) => void;
    onSaveAndExit: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    show,
    onClose,
    showFPS,
    setShowFPS,
    fpsLimit,
    setFpsLimit,
    onSaveAndExit
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wood-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-parchment-200 rounded-xl shadow-2xl border-4 border-double border-amber-500 relative overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(62,39,35,0.4)_100%)] pointer-events-none"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-wood-600 hover:text-red-700 transition-colors z-20"
                >
                    <i className="fa-solid fa-times text-xl drop-shadow-sm"></i>
                </button>

                {/* Header */}
                <div className="bg-wood-800/10 p-6 text-center border-b-2 border-wood-400/30 relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                    <div className="text-4xl mb-2 text-wood-800 drop-shadow-sm">
                        <i className="fa-solid fa-gear"></i>
                    </div>
                    <h2 className="font-heading text-3xl text-wood-900 uppercase tracking-widest drop-shadow-sm">Configurações</h2>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-amber-500 rotate-45 border-2 border-parchment-200"></div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 pb-10">
                    {/* FPS Monitor */}
                    <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                            <span className="font-heading text-wood-900 text-lg">Monitor de FPS</span>
                            <span className="text-xs text-wood-600 font-serif italic">Exibir quadros por segundo</span>
                        </div>
                        <button
                            onClick={() => setShowFPS(!showFPS)}
                            className={`relative px-4 py-1.5 rounded-lg font-heading text-sm border-2 transition-all shadow-md active:translate-y-[1px] w-28
                                ${showFPS
                                    ? 'bg-wood-700 text-parchment-100 border-wood-900'
                                    : 'bg-parchment-100 text-wood-500 border-wood-300 hover:border-wood-400'
                                }`}
                        >
                            {showFPS ? (
                                <span className="flex items-center justify-center gap-2"><i className="fa-solid fa-check text-xs"></i> LIGADO</span>
                            ) : (
                                <span>DESLIGADO</span>
                            )}
                        </button>
                    </div>

                    <div className="h-px bg-wood-300/30 w-full"></div>

                    {/* VSync */}
                    <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                            <span className="font-heading text-wood-900 text-lg">Limite de FPS</span>
                            <span className="text-xs text-wood-600 font-serif italic">Sincronização vertical (VSync)</span>
                        </div>
                        <button
                            onClick={() => setFpsLimit(prev => prev === 'vsync' ? 'unlimited' : 'vsync')}
                            className={`relative px-4 py-1.5 rounded-lg font-heading text-sm border-2 transition-all shadow-md active:translate-y-[1px] w-28
                                ${fpsLimit === 'vsync'
                                    ? 'bg-wood-700 text-parchment-100 border-wood-900'
                                    : 'bg-parchment-100 text-wood-500 border-wood-300 hover:border-wood-400'
                                }`}
                        >
                            {fpsLimit === 'vsync' ? (
                                <span className="flex items-center justify-center gap-2"><i className="fa-solid fa-lock text-xs"></i> LIGADO</span>
                            ) : (
                                <span>DESLIGADO</span>
                            )}
                        </button>
                    </div>

                    <div className="h-px bg-wood-300/30 w-full"></div>

                    {/* Save and Exit */}
                    <div className="flex items-center justify-between group">
                        <div className="flex flex-col">
                            <span className="font-heading text-wood-900 text-lg">Progresso</span>
                            <span className="text-xs text-wood-600 font-serif italic">Salvar jogo e sair</span>
                        </div>
                        <button
                            onClick={onSaveAndExit}
                            className="px-4 py-2 rounded-lg font-heading text-sm border-2 border-amber-900 bg-amber-700 text-parchment-100 shadow-md hover:bg-amber-600 hover:shadow-lg transition-all active:translate-y-[1px] flex items-center gap-2"
                        >
                            <i className="fa-solid fa-floppy-disk"></i>
                            SALVAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
