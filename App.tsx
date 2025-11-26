import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types';
import { 
  WheatIcon, PeasantIcon, MillIcon, StableIcon, 
  GuildIcon, MarketIcon, CastleIcon, CathedralIcon, CitadelIcon, KingdomIcon 
} from './components/Icons';

// --- CONFIGURAÇÃO DE BALANCEAMENTO ---

// Custos (Cada Tier custa unidades do Tier anterior)
const PEASANT_COST = 10;      // Trigos
const MILL_COST = 10;         // Camponeses
const STABLE_COST = 10;       // Moinhos
const GUILD_COST = 15;        // Estábulos
const MARKET_COST = 20;       // Guildas
const CASTLE_COST = 25;       // Mercados
const CATHEDRAL_COST = 30;    // Castelos
const CATHEDRAL_COST_2 = 30;  // Fix linter duplicate if any
const CITADEL_COST = 40;      // Catedrais
const KINGDOM_COST = 50;      // Cidadelas

// Tempos de Produção (ms)
const HARVEST_DURATION_MS = 2000;
const MILL_DURATION_MS = 5000;
const STABLE_DURATION_MS = 12000;
const GUILD_DURATION_MS = 20000;
const MARKET_DURATION_MS = 30000;
const CASTLE_DURATION_MS = 45000;
const CATHEDRAL_DURATION_MS = 60000;
const CITADEL_DURATION_MS = 90000;
const KINGDOM_DURATION_MS = 120000;

// Produção (Output por ciclo)
const WHEAT_PER_HARVEST = 3;
const PEASANTS_PER_MILL_CYCLE = 4;
const MILLS_PER_STABLE_CYCLE = 5;
const STABLES_PER_GUILD_CYCLE = 6;
const GUILDS_PER_MARKET_CYCLE = 8;
const MARKETS_PER_CASTLE_CYCLE = 10;
const CASTLES_PER_CATHEDRAL_CYCLE = 15;
const CATHEDRALS_PER_CITADEL_CYCLE = 20;
const CITADELS_PER_KINGDOM_CYCLE = 25;

const SAVE_KEY = 'reino_trigo_save_v2';
const AUTOMATION_THRESHOLD = 5; // Quantidade do tier superior necessária para automatizar o atual

const INITIAL_STATE: GameState = {
  wheat: 0,
  peasants: 1,
  mills: 0,
  stables: 0,
  guilds: 0,
  markets: 0,
  castles: 0,
  cathedrals: 0,
  citadels: 0,
  kingdoms: 0,
  
  totalHarvested: 0,
  totalPeasantsGenerated: 0,
  totalMillsGenerated: 0,
  totalStablesGenerated: 0,
  totalGuildsGenerated: 0,
  totalMarketsGenerated: 0,
  totalCastlesGenerated: 0,
  totalCathedralsGenerated: 0,
  totalCitadelsGenerated: 0,
  totalKingdomsGenerated: 0,
};

type BuyMode = '1' | '1%' | '10%' | '50%' | '100%';
type GeneratorType = 'peasant' | 'mill' | 'stable' | 'guild' | 'market' | 'castle' | 'cathedral' | 'citadel' | 'kingdom';
type FPSLimit = number | 'vsync' | 'unlimited';

// Ordered list for rendering and progression logic
const GENERATOR_ORDER: GeneratorType[] = [
  'peasant', 'mill', 'stable', 'guild', 'market', 
  'castle', 'cathedral', 'citadel', 'kingdom'
];

// Mapping generator type to GameState plural keys
const STATE_KEYS: Record<GeneratorType, keyof GameState> = {
  peasant: 'peasants',
  mill: 'mills',
  stable: 'stables',
  guild: 'guilds',
  market: 'markets',
  castle: 'castles',
  cathedral: 'cathedrals',
  citadel: 'citadels',
  kingdom: 'kingdoms'
};

// Info Data Structure
const GENERATOR_INFO = {
  peasant: {
    name: "Camponês",
    icon: PeasantIcon,
    flavor: "Um trabalhador humilde e incansável. Com suas mãos calejadas, ele garante que o reino nunca passe fome.",
    costAmount: PEASANT_COST,
    costIcon: WheatIcon,
    costColor: "text-harvest",
    prodAmount: WHEAT_PER_HARVEST,
    prodIcon: WheatIcon,
    prodColor: "text-harvest",
    duration: HARVEST_DURATION_MS / 1000,
    colorClass: "text-harvest-dark",
    totalLabel: "Colheita Vitalícia",
    totalKey: "totalHarvested" as keyof GameState
  },
  mill: {
    name: "Moinho de Vento",
    icon: MillIcon,
    flavor: "Uma maravilha da engenharia rústica. Suas pás giratórias atraem novos trabalhadores de terras distantes.",
    costAmount: MILL_COST,
    costIcon: PeasantIcon,
    costColor: "text-harvest-dark",
    prodAmount: PEASANTS_PER_MILL_CYCLE,
    prodIcon: PeasantIcon,
    prodColor: "text-harvest-dark",
    duration: MILL_DURATION_MS / 1000,
    colorClass: "text-sky-700",
    totalLabel: "População Atraída",
    totalKey: "totalPeasantsGenerated" as keyof GameState
  },
  stable: {
    name: "Estábulo",
    icon: StableIcon,
    flavor: "O lar de bestas de carga fortes. A logística aprimorada facilita o transporte de materiais para novos moinhos.",
    costAmount: STABLE_COST,
    costIcon: MillIcon,
    costColor: "text-sky-700",
    prodAmount: MILLS_PER_STABLE_CYCLE,
    prodIcon: MillIcon,
    prodColor: "text-sky-700",
    duration: STABLE_DURATION_MS / 1000,
    colorClass: "text-emerald-700",
    totalLabel: "Indústria Expandida",
    totalKey: "totalMillsGenerated" as keyof GameState
  },
  guild: {
    name: "Guilda de Comércio",
    icon: GuildIcon,
    flavor: "Uniões de artesãos e comerciantes que organizam a economia, financiando a construção de mais estábulos.",
    costAmount: GUILD_COST,
    costIcon: StableIcon,
    costColor: "text-emerald-700",
    prodAmount: STABLES_PER_GUILD_CYCLE,
    prodIcon: StableIcon,
    prodColor: "text-emerald-700",
    duration: GUILD_DURATION_MS / 1000,
    colorClass: "text-purple-700",
    totalLabel: "Logística Financiada",
    totalKey: "totalStablesGenerated" as keyof GameState
  },
  market: {
    name: "Mercado Central",
    icon: MarketIcon,
    flavor: "O coração pulsante da troca de mercadorias. O fluxo de ouro permite a fundação de novas guildas.",
    costAmount: MARKET_COST,
    costIcon: GuildIcon,
    costColor: "text-purple-700",
    prodAmount: GUILDS_PER_MARKET_CYCLE,
    prodIcon: GuildIcon,
    prodColor: "text-purple-700",
    duration: MARKET_DURATION_MS / 1000,
    colorClass: "text-red-700",
    totalLabel: "Comércio Gerado",
    totalKey: "totalGuildsGenerated" as keyof GameState
  },
  castle: {
    name: "Castelo Feudal",
    icon: CastleIcon,
    flavor: "A sede do poder local. Lordes e barões decretam a abertura de novos mercados em suas terras.",
    costAmount: CASTLE_COST,
    costIcon: MarketIcon,
    costColor: "text-red-700",
    prodAmount: MARKETS_PER_CASTLE_CYCLE,
    prodIcon: MarketIcon,
    prodColor: "text-red-700",
    duration: CASTLE_DURATION_MS / 1000,
    colorClass: "text-gray-600",
    totalLabel: "Decretos Reais",
    totalKey: "totalMarketsGenerated" as keyof GameState
  },
  cathedral: {
    name: "Grande Catedral",
    icon: CathedralIcon,
    flavor: "Símbolo da fé divina. A influência religiosa unifica regiões, permitindo a construção de novos castelos.",
    costAmount: CATHEDRAL_COST,
    costIcon: CastleIcon,
    costColor: "text-gray-600",
    prodAmount: CASTLES_PER_CATHEDRAL_CYCLE,
    prodIcon: CastleIcon,
    prodColor: "text-gray-600",
    duration: CATHEDRAL_DURATION_MS / 1000,
    colorClass: "text-yellow-600",
    totalLabel: "Fortalezas Abençoadas",
    totalKey: "totalCastlesGenerated" as keyof GameState
  },
  citadel: {
    name: "Cidadela Fortificada",
    icon: CitadelIcon,
    flavor: "Uma metrópole impenetrável. Sua proteção absoluta permite erguer catedrais cada vez maiores.",
    costAmount: CITADEL_COST,
    costIcon: CathedralIcon,
    costColor: "text-yellow-600",
    prodAmount: CATHEDRALS_PER_CITADEL_CYCLE,
    prodIcon: CathedralIcon,
    prodColor: "text-yellow-600",
    duration: CITADEL_DURATION_MS / 1000,
    colorClass: "text-stone-800",
    totalLabel: "Templos Erguidos",
    totalKey: "totalCathedralsGenerated" as keyof GameState
  },
  kingdom: {
    name: "Reino Soberano",
    icon: KingdomIcon,
    flavor: "A unificação suprema de todas as terras. O conceito de nação expande as fronteiras, criando novas cidadelas.",
    costAmount: KINGDOM_COST,
    costIcon: CitadelIcon,
    costColor: "text-stone-800",
    prodAmount: CITADELS_PER_KINGDOM_CYCLE,
    prodIcon: CitadelIcon,
    prodColor: "text-stone-800",
    duration: KINGDOM_DURATION_MS / 1000,
    colorClass: "text-blue-900",
    totalLabel: "Império Expandido",
    totalKey: "totalCitadelsGenerated" as keyof GameState
  }
};

// Utility to format numbers
const formatNumber = (num: number) => {
  const n = Math.floor(num);

  if (n < 1000000) {
    return new Intl.NumberFormat('pt-BR').format(n);
  }

  const suffixes = [
    { val: 1e63, suffix: 'Vg' },
    { val: 1e60, suffix: 'Nod' },
    { val: 1e57, suffix: 'Ocd' },
    { val: 1e54, suffix: 'Spd' },
    { val: 1e51, suffix: 'Sxd' },
    { val: 1e48, suffix: 'Qid' },
    { val: 1e45, suffix: 'Qad' },
    { val: 1e42, suffix: 'Td' },
    { val: 1e39, suffix: 'Dd' },
    { val: 1e36, suffix: 'Ud' },
    { val: 1e33, suffix: 'Dc' },
    { val: 1e30, suffix: 'No' },
    { val: 1e27, suffix: 'Oc' },
    { val: 1e24, suffix: 'Sp' },
    { val: 1e21, suffix: 'Sx' },
    { val: 1e18, suffix: 'Qi' },
    { val: 1e15, suffix: 'Qa' },
    { val: 1e12, suffix: 'T' },
    { val: 1e9, suffix: 'B' },
    { val: 1e6, suffix: 'M' }
  ];

  for (const { val, suffix } of suffixes) {
    if (n >= val) {
      return (n / val).toLocaleString('en-US', { maximumFractionDigits: 2 }) + suffix;
    }
  }

  return n.toString();
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_STATE, ...parsed };
      }
    } catch (e) {
      console.error("Erro ao carregar save:", e);
    }
    return INITIAL_STATE;
  });

  const isResettingRef = useRef(false);
  const stateRef = useRef(gameState);
  
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isResettingRef.current) return;
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []);

  const [progress, setProgress] = useState({
    wheat: 0,
    mill: 0,
    stable: 0,
    guild: 0,
    market: 0,
    castle: 0,
    cathedral: 0,
    citadel: 0,
    kingdom: 0
  });

  // Helper map for progress keys since 'peasant' uses 'wheat'
  const PROGRESS_KEYS: Record<GeneratorType, keyof typeof progress> = {
    peasant: 'wheat',
    mill: 'mill',
    stable: 'stable',
    guild: 'guild',
    market: 'market',
    castle: 'castle',
    cathedral: 'cathedral',
    citadel: 'citadel',
    kingdom: 'kingdom'
  };

  const [fpsLimit] = useState<FPSLimit>('vsync');
  const [actualFPS, setActualFPS] = useState(0);
  const [showFPS, setShowFPS] = useState(true);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const loopRef = useRef<number | NodeJS.Timeout | null>(null);

  const [buyMode, setBuyMode] = useState<BuyMode>('1');
  const [holdingBtn, setHoldingBtn] = useState<GeneratorType | null>(null);
  const [infoModal, setInfoModal] = useState<GeneratorType | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const calculatePurchase = (type: GeneratorType, current: GameState) => {
    let costPerUnit = 0;
    let availableCurrency = 0;

    switch (type) {
      case 'peasant': costPerUnit = PEASANT_COST; availableCurrency = current.wheat; break;
      case 'mill': costPerUnit = MILL_COST; availableCurrency = current.peasants; break;
      case 'stable': costPerUnit = STABLE_COST; availableCurrency = current.mills; break;
      case 'guild': costPerUnit = GUILD_COST; availableCurrency = current.stables; break;
      case 'market': costPerUnit = MARKET_COST; availableCurrency = current.guilds; break;
      case 'castle': costPerUnit = CASTLE_COST; availableCurrency = current.markets; break;
      case 'cathedral': costPerUnit = CATHEDRAL_COST; availableCurrency = current.castles; break;
      case 'citadel': costPerUnit = CITADEL_COST; availableCurrency = current.cathedrals; break;
      case 'kingdom': costPerUnit = KINGDOM_COST; availableCurrency = current.citadels; break;
    }

    const maxAffordable = Math.floor(availableCurrency / costPerUnit);
    let amount = 0;

    if (buyMode === '1') {
      amount = 1;
    } else {
      const percentage = parseFloat(buyMode) / 100;
      amount = Math.max(1, Math.floor(maxAffordable * percentage));
    }

    if (amount > maxAffordable) amount = maxAffordable;
    if (maxAffordable === 0) amount = 0;

    return {
      amount,
      totalCost: amount * costPerUnit,
      canAfford: amount > 0
    };
  };

  const toggleBuyMode = () => {
    const modes: BuyMode[] = ['1', '1%', '10%', '50%', '100%'];
    const currentIndex = modes.indexOf(buyMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setBuyMode(modes[nextIndex]);
  };

  useEffect(() => {
    const measureInterval = setInterval(() => {
      setActualFPS(framesRef.current);
      framesRef.current = 0;
    }, 1000);
    return () => clearInterval(measureInterval);
  }, []);

  // MAIN GAME LOOP
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const loop = () => {
      if (isResettingRef.current) return;

      const now = performance.now();
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      framesRef.current++;

      setProgress((prev) => {
        const state = stateRef.current;
        let updates = { ...prev };
        let stateUpdates: Partial<GameState> = {};
        let hasUpdates = false;

        // Helper for production logic
        const processGenerator = (
          count: number, 
          currentProg: number, 
          duration: number, 
          outputPerCycle: number,
          targetResource: keyof GameState,
          totalResource: keyof GameState
        ): number => {
          if (count <= 0) return currentProg;
          
          let nextProg = currentProg + ((dt / duration) * 100);
          if (nextProg >= 100) {
            const cycles = Math.floor(nextProg / 100);
            nextProg = nextProg % 100;
            const produced = count * outputPerCycle * cycles;
            
            // Queue state update
            stateUpdates[targetResource] = (stateUpdates[targetResource] || state[targetResource]) + produced;
            stateUpdates[totalResource] = (stateUpdates[totalResource] || state[totalResource]) + produced;
            hasUpdates = true;
          }
          return nextProg;
        };

        // 1. Peasant -> Wheat
        updates.wheat = processGenerator(state.peasants, prev.wheat, HARVEST_DURATION_MS, WHEAT_PER_HARVEST, 'wheat', 'totalHarvested');
        
        // 2. Mill -> Peasant
        updates.mill = processGenerator(state.mills, prev.mill, MILL_DURATION_MS, PEASANTS_PER_MILL_CYCLE, 'peasants', 'totalPeasantsGenerated');
        
        // 3. Stable -> Mill
        updates.stable = processGenerator(state.stables, prev.stable, STABLE_DURATION_MS, MILLS_PER_STABLE_CYCLE, 'mills', 'totalMillsGenerated');

        // 4. Guild -> Stable
        updates.guild = processGenerator(state.guilds, prev.guild, GUILD_DURATION_MS, STABLES_PER_GUILD_CYCLE, 'stables', 'totalStablesGenerated');

        // 5. Market -> Guild
        updates.market = processGenerator(state.markets, prev.market, MARKET_DURATION_MS, GUILDS_PER_MARKET_CYCLE, 'guilds', 'totalGuildsGenerated');

        // 6. Castle -> Market
        updates.castle = processGenerator(state.castles, prev.castle, CASTLE_DURATION_MS, MARKETS_PER_CASTLE_CYCLE, 'markets', 'totalMarketsGenerated');

        // 7. Cathedral -> Castle
        updates.cathedral = processGenerator(state.cathedrals, prev.cathedral, CATHEDRAL_DURATION_MS, CASTLES_PER_CATHEDRAL_CYCLE, 'castles', 'totalCastlesGenerated');

        // 8. Citadel -> Cathedral
        updates.citadel = processGenerator(state.citadels, prev.citadel, CITADEL_DURATION_MS, CATHEDRALS_PER_CITADEL_CYCLE, 'cathedrals', 'totalCathedralsGenerated');

        // 9. Kingdom -> Citadel
        updates.kingdom = processGenerator(state.kingdoms, prev.kingdom, KINGDOM_DURATION_MS, CITADELS_PER_KINGDOM_CYCLE, 'citadels', 'totalCitadelsGenerated');

        if (hasUpdates) {
          setGameState(curr => ({ ...curr, ...stateUpdates }));
        }

        return updates;
      });

      if (fpsLimit === 'vsync') {
        loopRef.current = requestAnimationFrame(loop);
      } else {
        loopRef.current = setTimeout(loop, 0);
      }
    };

    loop();

    return () => {
      if (typeof loopRef.current === 'number') {
        cancelAnimationFrame(loopRef.current);
      } else if (loopRef.current) {
        clearTimeout(loopRef.current as NodeJS.Timeout);
      }
    };
  }, [fpsLimit]);

  const executeBuy = (type: GeneratorType) => {
    setGameState((curr) => {
      const { amount, totalCost, canAfford } = calculatePurchase(type, curr);

      if (!canAfford) return curr;

      const nextState = { ...curr };

      switch (type) {
        case 'peasant': nextState.wheat -= totalCost; nextState.peasants += amount; break;
        case 'mill': nextState.peasants -= totalCost; nextState.mills += amount; break;
        case 'stable': nextState.mills -= totalCost; nextState.stables += amount; break;
        case 'guild': nextState.stables -= totalCost; nextState.guilds += amount; break;
        case 'market': nextState.guilds -= totalCost; nextState.markets += amount; break;
        case 'castle': nextState.markets -= totalCost; nextState.castles += amount; break;
        case 'cathedral': nextState.castles -= totalCost; nextState.cathedrals += amount; break;
        case 'citadel': nextState.cathedrals -= totalCost; nextState.citadels += amount; break;
        case 'kingdom': nextState.citadels -= totalCost; nextState.kingdoms += amount; break;
      }
      return nextState;
    });
  };

  useEffect(() => {
    if (!holdingBtn) return;
    const intervalId = setInterval(() => {
      executeBuy(holdingBtn);
    }, 150);
    return () => clearInterval(intervalId);
  }, [holdingBtn, buyMode]);

  const handlePressStart = (type: GeneratorType) => {
    executeBuy(type);
    setHoldingBtn(type);
  };
  const handlePressEnd = () => setHoldingBtn(null);

  const handleResetGame = () => {
    if (confirm("Tem certeza que deseja apagar todo o progresso?")) {
      isResettingRef.current = true;
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  // UI Helper for Generator Cards
  const renderGeneratorCard = (type: GeneratorType) => {
    const info = GENERATOR_INFO[type];
    const stateKey = STATE_KEYS[type];
    const progressKey = PROGRESS_KEYS[type];
    const count = gameState[stateKey];
    const progressValue = progress[progressKey];
    const purchaseData = calculatePurchase(type, gameState);
    const missingCost = Math.max(0, info.costAmount - (type === 'peasant' ? gameState.wheat : gameState[STATE_KEYS[GENERATOR_ORDER[GENERATOR_ORDER.indexOf(type) - 1]]]));

    // Check Automation Status
    const currentIndex = GENERATOR_ORDER.indexOf(type);
    const nextTierType = currentIndex < GENERATOR_ORDER.length - 1 ? GENERATOR_ORDER[currentIndex + 1] : null;
    const nextTierCount = nextTierType ? gameState[STATE_KEYS[nextTierType]] : 0;
    const isAutomated = nextTierCount >= AUTOMATION_THRESHOLD;

    let actualMissing = 0;
    if (!purchaseData.canAfford) {
       let available = 0;
       switch(type) {
         case 'peasant': available = gameState.wheat; break;
         case 'mill': available = gameState.peasants; break;
         case 'stable': available = gameState.mills; break;
         case 'guild': available = gameState.stables; break;
         case 'market': available = gameState.guilds; break;
         case 'castle': available = gameState.markets; break;
         case 'cathedral': available = gameState.castles; break;
         case 'citadel': available = gameState.cathedrals; break;
         case 'kingdom': available = gameState.citadels; break;
       }
       actualMissing = Math.max(0, info.costAmount - available);
    }

    const isAffordable = purchaseData.canAfford;

    return (
      <div key={type} className="flex flex-col gap-3 h-56">
        <div className="relative bg-white/40 rounded-xl p-6 border border-parchment-border shadow-sm overflow-hidden flex-1 flex flex-col justify-center">
          <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/rough-cloth.png')]"></div>
          
          <div className="absolute bottom-[-10px] right-[-15px] text-wood-900/5 text-9xl pointer-events-none transform -rotate-12 z-0">
             {React.createElement(info.icon)}
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full">
            <div className="mb-3 text-sm font-bold uppercase tracking-wider text-wood-700 flex items-center gap-2">
              {React.createElement(info.icon, { className: 'text-xl ' + info.colorClass })}
              {info.name}s
            </div>

            <div className="h-6 bg-wood-300/30 rounded-full p-[4px] shadow-inner mb-4">
              <div 
                className={`h-full rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] relative overflow-hidden transition-none ${info.colorClass.replace('text-', 'bg-')} ${info.colorClass.replace('text-', 'border-').replace('700', '400')}`}
                style={{ width: `${progressValue}%` }}
              >
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="bg-parchment-100 px-3 py-1 rounded border border-parchment-border shadow-sm text-wood-800 flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                <i className="fa-solid fa-cubes text-wood-600" />
                {formatNumber(count)}
              </span>

              <span className="bg-parchment-100 px-3 py-1 rounded border border-parchment-border shadow-sm text-wood-800 flex items-center gap-1 text-xs font-bold">
                {count > 0 ? `+${formatNumber(count * info.prodAmount)}` : '0'} 
                {React.createElement(info.prodIcon, { className: info.prodColor })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 h-10 shrink-0">
          {isAutomated ? (
             <div className="flex-1 rounded-lg bg-gradient-to-b from-yellow-300 to-yellow-500 border-2 border-yellow-700 shadow-md flex items-center justify-center gap-2 text-yellow-900 font-heading text-xs font-bold uppercase tracking-widest select-none cursor-default relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
                <i className="fa-solid fa-certificate text-sm"></i>
                Autossuficiente
             </div>
          ) : (
            <button
              onMouseDown={() => handlePressStart(type)}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={() => handlePressStart(type)}
              onTouchEnd={handlePressEnd}
              disabled={!isAffordable && holdingBtn !== type}
              className={`flex-1 rounded-lg font-heading text-sm font-bold tracking-widest uppercase transition-all duration-200 relative overflow-hidden shadow-md group select-none flex flex-col items-center justify-center h-full
                ${isAffordable 
                  ? 'bg-wood-700 text-parchment-100 border-2 border-wood-900 hover:bg-wood-800 hover:shadow-lg active:translate-y-[1px]' 
                  : 'bg-wood-300/50 text-wood-500 border-2 border-wood-300 cursor-not-allowed'
                }`}
            >
              {isAffordable && (
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
              )}
              <span className="relative z-10 drop-shadow-md flex items-center gap-2 justify-center w-full">
                {isAffordable 
                  ? `${type === 'peasant' ? 'Contratar' : 'Construir'}${purchaseData.amount > 1 ? ` (+${formatNumber(purchaseData.amount)})` : ''}` 
                  : (
                    <>
                      {formatNumber(actualMissing)} {React.createElement(info.costIcon, { className: "mb-0.5" })}
                    </>
                  )
                }
              </span>
            </button>
          )}
          
          <button
            onClick={() => setInfoModal(type)}
            className="w-10 h-full bg-wood-700 text-parchment-100 rounded-lg border-2 border-wood-900 shadow-md flex items-center justify-center hover:bg-wood-800 active:translate-y-[1px] transition-all relative overflow-hidden"
            title="Informações"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
             <i className="fa-solid fa-exclamation text-sm drop-shadow-md relative z-10"></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen font-body relative overflow-hidden bg-wood-900">
      <div className="absolute inset-0 bg-parchment-100 opacity-5 pointer-events-none z-0"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(62,39,35,0.4)_100%)]"></div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wood-900/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="w-full max-w-sm bg-parchment-200 rounded-lg shadow-2xl border-4 border-wood-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
              <button onClick={() => setShowSettings(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-wood-700 hover:text-wood-900 z-20"><i className="fa-solid fa-xmark text-xl"></i></button>
              <div className="bg-parchment-300/50 p-6 text-center border-b border-wood-300/30">
                <div className="text-4xl mb-3 text-wood-700"><i className="fa-solid fa-gear"></i></div>
                <h2 className="font-heading text-2xl text-wood-900">Configurações</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between bg-white/40 p-4 rounded border border-parchment-border">
                  <span className="font-bold text-wood-900 text-sm uppercase tracking-wider">Monitor de FPS</span>
                  <button onClick={() => setShowFPS(!showFPS)} className={`px-4 py-1.5 rounded font-heading text-sm border-2 transition-all shadow-sm ${showFPS ? 'bg-wood-700 text-parchment-100 border-wood-900' : 'bg-parchment-100 text-wood-500 border-wood-300'}`}>{showFPS ? 'LIGADO' : 'DESLIGADO'}</button>
                </div>
                <div className="flex flex-col gap-2 bg-white/40 p-4 rounded border border-parchment-border">
                  <span className="font-bold text-wood-900 text-sm uppercase tracking-wider text-center mb-2">Dados do Jogo</span>
                  <button onClick={handleResetGame} className="w-full px-4 py-2 bg-red-800 text-parchment-100 rounded font-heading text-sm border-2 border-red-900 hover:bg-red-700 transition-colors uppercase tracking-widest shadow-sm">Apagar Progresso</button>
                </div>
              </div>
              <div className="p-4 bg-wood-800 text-center"><button onClick={() => setShowSettings(false)} className="px-6 py-2 bg-wood-600 text-parchment-100 rounded font-heading border border-wood-500 hover:bg-wood-500 transition-colors uppercase tracking-widest text-sm">Fechar</button></div>
           </div>
        </div>
      )}

      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wood-900/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="w-full max-w-sm bg-parchment-200 rounded-lg shadow-2xl border-4 border-wood-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>
              <button onClick={() => setInfoModal(null)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-wood-700 hover:text-wood-900 z-20"><i className="fa-solid fa-xmark text-xl"></i></button>
              <div className="bg-parchment-300/50 p-6 text-center border-b border-wood-300/30">
                <div className={`text-4xl mb-3 ${GENERATOR_INFO[infoModal].colorClass}`}>{React.createElement(GENERATOR_INFO[infoModal].icon)}</div>
                <h2 className="font-heading text-2xl text-wood-900">{GENERATOR_INFO[infoModal].name}</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="italic text-wood-700 font-serif text-center leading-relaxed">"{GENERATOR_INFO[infoModal].flavor}"</p>
                <div className="bg-white/40 p-4 rounded border border-parchment-border mt-4">
                  <div className="flex justify-between items-center border-b border-wood-300/20 pb-2 mb-2">
                     <span className="font-bold text-wood-800 text-xs uppercase tracking-wider">Custo Base</span>
                     <span className="font-heading text-wood-900 flex items-center gap-2">{GENERATOR_INFO[infoModal].costAmount}{React.createElement(GENERATOR_INFO[infoModal].costIcon, { className: `text-lg ${GENERATOR_INFO[infoModal].costColor}` })}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-wood-300/20 pb-2 mb-2">
                     <span className="font-bold text-wood-800 text-xs uppercase tracking-wider">Produção</span>
                     <span className="font-heading text-wood-900 flex items-center gap-2">{GENERATOR_INFO[infoModal].prodAmount}{React.createElement(GENERATOR_INFO[infoModal].prodIcon, { className: `text-lg ${GENERATOR_INFO[infoModal].prodColor}` })}<span className="text-sm text-wood-600 ml-1 font-body font-bold">/ {GENERATOR_INFO[infoModal].duration}s</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="font-bold text-wood-800 text-xs uppercase tracking-wider">{GENERATOR_INFO[infoModal].totalLabel}</span>
                     <span className="font-heading text-wood-900 flex items-center gap-2">{formatNumber(gameState[GENERATOR_INFO[infoModal].totalKey])}{React.createElement(GENERATOR_INFO[infoModal].prodIcon, { className: `text-lg ${GENERATOR_INFO[infoModal].prodColor}` })}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-wood-800 text-center"><button onClick={() => setInfoModal(null)} className="px-6 py-2 bg-wood-600 text-parchment-100 rounded font-heading border border-wood-500 hover:bg-wood-500 transition-colors uppercase tracking-widest text-sm">Fechar</button></div>
           </div>
        </div>
      )}

      <div className="relative z-10 w-full h-full bg-parchment-200 overflow-hidden select-none flex flex-col">
        <header className="pt-6 pb-4 px-8 text-center bg-parchment-300/50 border-b border-wood-300/30 relative shrink-0">
          <button onClick={() => setShowSettings(true)} className="absolute top-4 right-4 text-wood-700 hover:text-wood-900 transition-colors"><i className="fa-solid fa-gear text-lg"></i></button>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-20 text-wood-900"><i className="fa-solid fa-crown text-2xl"></i></div>
          <h1 className="text-4xl md:text-5xl font-heading text-wood-900 drop-shadow-sm mb-1 tracking-tight">Reino do Trigo</h1>
          <p className="text-sm font-bold text-wood-500 uppercase tracking-widest text-[0.65rem]">Gestão Feudal</p>
        </header>

        <div className="border-b border-wood-300/30 bg-parchment-100/50 shrink-0">
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-wood-500 text-[10px] font-bold uppercase tracking-widest mb-1">Estoque Real</span>
            <div className="flex items-center gap-3 text-wood-900">
              <WheatIcon className="text-3xl text-harvest" />
              <span className="text-5xl font-heading leading-none">{formatNumber(gameState.wheat)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center p-2 bg-parchment-300/30 border-b border-wood-300/30 shrink-0">
          <div className="flex items-center">
             <button onClick={toggleBuyMode} className="min-w-[2.5rem] px-2 py-0.5 rounded font-heading font-bold text-[10px] bg-wood-700 text-parchment-100 border border-wood-900 shadow-sm hover:bg-wood-600 transition-all flex items-center justify-center active:translate-y-[1px] select-none" title="Clique para mudar a quantidade de compra"><span>{buyMode}</span></button>
          </div>
        </div>

        <div className="flex-1 p-10 bg-parchment-300 shadow-inner grid grid-cols-1 lg:grid-cols-3 gap-10 overflow-y-auto">
          {GENERATOR_ORDER.map((type, index) => {
            const prevType = index > 0 ? GENERATOR_ORDER[index - 1] : null;
            // Visible if: It's the first one OR we have the previous one OR we already own the current one
            const isVisible = index === 0 || (prevType && (gameState[STATE_KEYS[prevType]] > 0 || gameState[STATE_KEYS[type]] > 0));

            if (!isVisible) return null;

            return renderGeneratorCard(type);
          })}
        </div>

        <div className="bg-wood-900 py-3 border-t-4 border-wood-700 relative flex items-center justify-center h-10 shrink-0">
           <div className="text-parchment-100/30"><i className="fa-brands fa-fort-awesome text-xs"></i></div>
           {showFPS && <div className="absolute right-4 text-[10px] text-parchment-100 font-mono"><span title="Quadros por segundo atuais">FPS: {actualFPS}</span></div>}
        </div>
      </div>
    );
  }
}