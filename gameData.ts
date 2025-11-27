import Decimal from 'break_infinity.js';
import {
    WheatIcon, PeasantIcon, MillIcon, StableIcon,
    GuildIcon, MarketIcon, CastleIcon, CathedralIcon, CitadelIcon, KingdomIcon
} from './components/Icons';
import { GameState } from './types';

// --- TYPES ---
export type BuyMode = '1' | '1%' | '10%' | '50%' | '100%';
export type GeneratorType = 'peasant' | 'mill' | 'stable' | 'guild' | 'market' | 'castle' | 'cathedral' | 'citadel' | 'kingdom';

// --- CONFIGURAÇÃO DE BALANCEAMENTO ---
export const WORKER_COST = 1;

// Base Wheat Costs
export const PEASANT_WHEAT_COST = 10;
export const MILL_WHEAT_COST = 100;
export const STABLE_WHEAT_COST = 1000;
export const GUILD_WHEAT_COST = 10000;
export const MARKET_WHEAT_COST = 100000;
export const CASTLE_WHEAT_COST = 1000000;
export const CATHEDRAL_WHEAT_COST = 10000000;
export const CITADEL_WHEAT_COST = 100000000;
export const KINGDOM_WHEAT_COST = 1000000000;

// Previous Tier Costs (Quantity)
export const PEASANT_PREV_COST = 0; // No previous tier
export const MILL_PREV_COST = 15;
export const STABLE_PREV_COST = 25;
export const GUILD_PREV_COST = 35;
export const MARKET_PREV_COST = 45;
export const CASTLE_PREV_COST = 55;
export const CATHEDRAL_PREV_COST = 65;
export const CITADEL_PREV_COST = 75;
export const KINGDOM_PREV_COST = 85;

// Legacy constants for compatibility (will be removed/unused in new logic but kept to avoid immediate break if referenced elsewhere)
export const PEASANT_COST = 10;
export const MILL_COST = 10;
export const STABLE_COST = 10;
export const GUILD_COST = 15;
export const MARKET_COST = 20;
export const CASTLE_COST = 25;
export const CATHEDRAL_COST = 30;
export const CITADEL_COST = 40;
export const KINGDOM_COST = 50;

export const HARVEST_DURATION_MS = 2000;
export const MILL_DURATION_MS = 5000;
export const STABLE_DURATION_MS = 12000;
export const GUILD_DURATION_MS = 20000;
export const MARKET_DURATION_MS = 30000;
export const CASTLE_DURATION_MS = 45000;
export const CATHEDRAL_DURATION_MS = 60000;
export const CITADEL_DURATION_MS = 90000;
export const KINGDOM_DURATION_MS = 120000;

export const WHEAT_PER_HARVEST = 3;
export const PEASANTS_PER_MILL_CYCLE = 4;
export const MILLS_PER_STABLE_CYCLE = 5;
export const STABLES_PER_GUILD_CYCLE = 6;
export const GUILDS_PER_MARKET_CYCLE = 7;
export const MARKETS_PER_CASTLE_CYCLE = 8;
export const CASTLES_PER_CATHEDRAL_CYCLE = 9;
export const CATHEDRALS_PER_CITADEL_CYCLE = 10;
export const CITADELS_PER_KINGDOM_CYCLE = 11;

export const SAVE_KEY = 'reino_trigo_save_v2';

export const INITIAL_STATE: GameState = {
    wheat: new Decimal(0),
    workers: new Decimal(0),
    peasants: new Decimal(1),
    mills: new Decimal(0),
    stables: new Decimal(0),
    guilds: new Decimal(0),
    markets: new Decimal(0),
    castles: new Decimal(0),
    cathedrals: new Decimal(0),
    citadels: new Decimal(0),
    kingdoms: new Decimal(0),

    totalHarvested: new Decimal(0),
    totalWorkersGenerated: new Decimal(0),
    totalPeasantsGenerated: new Decimal(0),
    totalMillsGenerated: new Decimal(0),
    totalStablesGenerated: new Decimal(0),
    totalGuildsGenerated: new Decimal(0),
    totalMarketsGenerated: new Decimal(0),
    totalCastlesGenerated: new Decimal(0),
    totalCathedralsGenerated: new Decimal(0),
    totalCitadelsGenerated: new Decimal(0),
    totalKingdomsGenerated: new Decimal(0),

    upgrades: {},
};

export const AUTOMATION_THRESHOLD = 5;

// --- LISTS & MAPS ---
export const GENERATOR_ORDER: GeneratorType[] = [
    'peasant', 'mill', 'stable', 'guild', 'market',
    'castle', 'cathedral', 'citadel', 'kingdom'
];

export const STATE_KEYS: Record<GeneratorType, keyof GameState> = {
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

// --- UPGRADES ---
export interface Upgrade {
    id: string;
    name: string;
    type: 'speed' | 'efficiency';
    generatorType: GeneratorType;
    multiplier: number;
    cost: number;
    description: string;
    maxRank?: number;
    costMultiplier?: number;
}

export const UPGRADES_DATA: Upgrade[] = [
    { id: 'peasant_eff_1', name: 'Foices de Aço', type: 'efficiency', generatorType: 'peasant', multiplier: 2, cost: 100, description: 'Dobra a quantidade de trigo colhido.' },
    { id: 'peasant_spd_1', name: 'Botas Leves', type: 'speed', generatorType: 'peasant', multiplier: 2, cost: 250, description: 'Dobra a velocidade de movimento dos camponeses.' },
    { id: 'mill_eff_1', name: 'Velas Reforçadas', type: 'efficiency', generatorType: 'mill', multiplier: 2, cost: 1000, description: 'Dobra a atração de camponeses.' },
    { id: 'mill_spd_1', name: 'Engrenagens Óleadas', type: 'speed', generatorType: 'mill', multiplier: 2, cost: 2500, description: 'Moinhos giram 2x mais rápido.' },
    { id: 'stable_eff_1', name: 'Cavalos de Tração', type: 'efficiency', generatorType: 'stable', multiplier: 2, cost: 10000, description: 'Transporta materiais para 2x mais moinhos.' },
    { id: 'stable_spd_1', name: 'Estradas Pavimentadas', type: 'speed', generatorType: 'stable', multiplier: 2, cost: 25000, description: 'Viagens logísticas 2x mais rápidas.' },
    { id: 'guild_eff_1', name: 'Pesos Padronizados', type: 'efficiency', generatorType: 'guild', multiplier: 2, cost: 100000, description: 'Negociações rendem 2x mais estábulos.' },
    { id: 'guild_spd_1', name: 'Rotas Comerciais', type: 'speed', generatorType: 'guild', multiplier: 2, cost: 250000, description: 'Guildas operam com o dobro da velocidade.' },
    { id: 'market_eff_1', name: 'Moedas de Ouro', type: 'efficiency', generatorType: 'market', multiplier: 2, cost: 1000000, description: 'Fluxo de caixa permite fundar 2x mais guildas.' },
    { id: 'market_spd_1', name: 'Ábacos Avançados', type: 'speed', generatorType: 'market', multiplier: 2, cost: 2500000, description: 'Contadores trabalham 2x mais rápido.' },
    { id: 'castle_eff_1', name: 'Muralhas de Pedra', type: 'efficiency', generatorType: 'castle', multiplier: 2, cost: 10000000, description: 'Segurança atrai 2x mais mercados.' },
    { id: 'castle_spd_1', name: 'Decretos Reais', type: 'speed', generatorType: 'castle', multiplier: 2, cost: 25000000, description: 'Ordens são executadas 2x mais rápido.' },
    { id: 'cathedral_eff_1', name: 'Vitrais Sagrados', type: 'efficiency', generatorType: 'cathedral', multiplier: 2, cost: 100000000, description: 'Fé inspira a construção de 2x mais castelos.' },
    { id: 'cathedral_spd_1', name: 'Cantos Gregorianos', type: 'speed', generatorType: 'cathedral', multiplier: 2, cost: 250000000, description: 'Rituais finalizados na metade do tempo.' },
    { id: 'citadel_eff_1', name: 'Torres de Balista', type: 'efficiency', generatorType: 'citadel', multiplier: 2, cost: 1000000000, description: 'Defesa absoluta permite erguer 2x mais catedrais.' },
    { id: 'citadel_spd_1', name: 'Fossos Profundos', type: 'speed', generatorType: 'citadel', multiplier: 2, cost: 2500000000, description: 'Segurança agiliza a construção.' },
    { id: 'kingdom_eff_1', name: 'Jóias da Coroa', type: 'efficiency', generatorType: 'kingdom', multiplier: 2, cost: 10000000000, description: 'Prestígio unifica 2x mais cidadelas.' },
    { id: 'kingdom_spd_1', name: 'Exército Imperial', type: 'speed', generatorType: 'kingdom', multiplier: 2, cost: 25000000000, description: 'Conquistas ocorrem 2x mais rápido.' },
];

export const GENERATOR_INFO = {
    peasant: {
        name: "Camponês",
        icon: PeasantIcon,
        flavor: "Um trabalhador humilde e incansável. Com suas mãos calejadas, ele garante que o reino nunca passe fome.",
        costAmount: new Decimal(PEASANT_COST),
        costIcon: WheatIcon,
        costColor: "text-harvest",
        prodAmount: new Decimal(WHEAT_PER_HARVEST),
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
        costAmount: new Decimal(MILL_COST),
        costIcon: PeasantIcon,
        costColor: "text-harvest-dark",
        prodAmount: new Decimal(PEASANTS_PER_MILL_CYCLE),
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
        costAmount: new Decimal(STABLE_COST),
        costIcon: MillIcon,
        costColor: "text-sky-700",
        prodAmount: new Decimal(MILLS_PER_STABLE_CYCLE),
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
        costAmount: new Decimal(GUILD_COST),
        costIcon: StableIcon,
        costColor: "text-emerald-700",
        prodAmount: new Decimal(STABLES_PER_GUILD_CYCLE),
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
        costAmount: new Decimal(MARKET_COST),
        costIcon: GuildIcon,
        costColor: "text-purple-700",
        prodAmount: new Decimal(GUILDS_PER_MARKET_CYCLE),
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
        costAmount: new Decimal(CASTLE_COST),
        costIcon: MarketIcon,
        costColor: "text-red-700",
        prodAmount: new Decimal(MARKETS_PER_CASTLE_CYCLE),
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
        costAmount: new Decimal(CATHEDRAL_COST),
        costIcon: CastleIcon,
        costColor: "text-gray-600",
        prodAmount: new Decimal(CASTLES_PER_CATHEDRAL_CYCLE),
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
        costAmount: new Decimal(CITADEL_COST),
        costIcon: CathedralIcon,
        costColor: "text-yellow-600",
        prodAmount: new Decimal(CATHEDRALS_PER_CITADEL_CYCLE),
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
        costAmount: new Decimal(KINGDOM_COST),
        costIcon: CitadelIcon,
        costColor: "text-stone-800",
        prodAmount: new Decimal(CITADELS_PER_KINGDOM_CYCLE),
        prodIcon: CitadelIcon,
        prodColor: "text-stone-800",
        duration: KINGDOM_DURATION_MS / 1000,
        colorClass: "text-blue-900",
        totalLabel: "Império Expandido",
        totalKey: "totalCitadelsGenerated" as keyof GameState
    }
};

// --- UTILS ---
export const formatNumber = (num: Decimal | number) => {
    const n = new Decimal(num);

    if (n.lt(1000000)) {
        return new Intl.NumberFormat('pt-BR').format(n.toNumber());
    }

    const suffixes = [
        'Milhão', 'Bilhão', 'Trilhão', 'Quadrilhão', 'Quintilhão', 'Sextilhão', 'Septilhão', 'Octilhão', 'Nonilhão', 'Decilhão',
        'Undecilhão', 'Duodecilhão', 'Tredecilhão', 'Quatuordecilhão', 'Quindecilhão', 'Sexdecilhão', 'Septendecilhão', 'Octodecilhão', 'Novendecilhão', 'Vigintilhão',
        'Unvigintilhão', 'Duovigintilhão', 'Trevigintilhão', 'Quatuorvigintilhão', 'Quinvigintilhão', 'Sexvigintilhão', 'Septenvigintilhão', 'Octovigintilhão', 'Novenvigintilhão', 'Trigintilhão',
        'Untrigintilhão', 'Duotrigintilhão', 'Tretrigintilhão', 'Quatuortrigintilhão', 'Quintrigintilhão', 'Sextrigintilhão', 'Septentrigintilhão', 'Octotrigintilhão', 'Noventrigintilhão', 'Quadragintilhão',
        'Unquadragintilhão', 'Duoquadragintilhão', 'Trequadragintilhão', 'Quatuorquadragintilhão', 'Quinquadragintilhão', 'Sexquadragintilhão', 'Septenquadragintilhão', 'Octoquadragintilhão', 'Novenquadragintilhão', 'Quinquagintilhão',
        'Unquinquagintilhão', 'Duoquinquagintilhão', 'Trequinquagintilhão', 'Quatuorquinquagintilhão', 'Quinquinquagintilhão', 'Sexquinquagintilhão', 'Septenquinquagintilhão', 'Octoquinquagintilhão', 'Novenquinquagintilhão', 'Sexagintilhão',
        'Unsexagintilhão', 'Duosexagintilhão', 'Tresexagintilhão', 'Quatuorsexagintilhão', 'Quinsexagintilhão', 'Sexsexagintilhão', 'Septensexagintilhão', 'Octosexagintilhão', 'Novensexagintilhão', 'Septuagintilhão',
        'Unseptuagintilhão', 'Duoseptuagintilhão', 'Treseptuagintilhão', 'Quatuorseptuagintilhão', 'Quinseptuagintilhão', 'Sexseptuagintilhão', 'Septenseptuagintilhão', 'Octoseptuagintilhão', 'Novenseptuagintilhão', 'Octogintilhão',
        'Unoctogintilhão', 'Duooctogintilhão', 'Treoctogintilhão', 'Quatuoroctogintilhão', 'Quinoctogintilhão', 'Sexoctogintilhão', 'Septenoctogintilhão', 'Octooctogintilhão', 'Novenoctogintilhão', 'Nonagintilhão',
        'Unnonagintilhão', 'Duononagintilhão', 'Trenonagintilhão', 'Quatuornonagintilhão', 'Quinnonagintilhão', 'Sexnonagintilhão', 'Septennonagintilhão', 'Octononagintilhão', 'Novennonagintilhão', 'Centilhão'
    ];

    const suffixIndex = Math.floor((n.e - 6) / 3);

    if (suffixIndex < suffixes.length) {
        const divisor = new Decimal(10).pow(suffixIndex * 3 + 6);
        return (n.div(divisor)).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 }) + '\u00A0' + suffixes[suffixIndex];
    }

    return n.toExponential(2).replace('+', '');
};

export const getUpgradesForType = (type: GeneratorType) => {
    return UPGRADES_DATA.filter(u => u.generatorType === type);
};

export const getUpgradeCost = (upgrade: Upgrade, currentRank: number) => {
    const costMult = upgrade.costMultiplier || 2.5;
    return new Decimal(upgrade.cost).mul(new Decimal(costMult).pow(currentRank)).floor();
};

export const calculateMultipliers = (type: GeneratorType, upgrades: Record<string, number>) => {
    const relevantUpgrades = getUpgradesForType(type);
    let speedMult = 1;
    let effMult = new Decimal(1);

    relevantUpgrades.forEach(u => {
        const rank = upgrades[u.id] || 0;
        if (rank > 0) {
            if (u.type === 'speed') {
                speedMult *= Math.pow(u.multiplier, rank);
            }
            if (u.type === 'efficiency') {
                effMult = effMult.mul(new Decimal(u.multiplier).pow(rank));
            }
        }
    });

    return { speedMult, effMult };
};

export const calculatePurchase = (type: GeneratorType, current: GameState, buyMode: BuyMode) => {
    let wheatCostBase = new Decimal(0);
    let prevTierCostBase = new Decimal(0);
    let workerCostBase = new Decimal(WORKER_COST);

    let prevTierKey: keyof GameState | null = null;

    switch (type) {
        case 'peasant':
            wheatCostBase = new Decimal(PEASANT_WHEAT_COST);
            prevTierCostBase = new Decimal(0);
            prevTierKey = null;
            break;
        case 'mill':
            wheatCostBase = new Decimal(MILL_WHEAT_COST);
            prevTierCostBase = new Decimal(MILL_PREV_COST);
            prevTierKey = 'peasants';
            break;
        case 'stable':
            wheatCostBase = new Decimal(STABLE_WHEAT_COST);
            prevTierCostBase = new Decimal(STABLE_PREV_COST);
            prevTierKey = 'mills';
            break;
        case 'guild':
            wheatCostBase = new Decimal(GUILD_WHEAT_COST);
            prevTierCostBase = new Decimal(GUILD_PREV_COST);
            prevTierKey = 'stables';
            break;
        case 'market':
            wheatCostBase = new Decimal(MARKET_WHEAT_COST);
            prevTierCostBase = new Decimal(MARKET_PREV_COST);
            prevTierKey = 'guilds';
            break;
        case 'castle':
            wheatCostBase = new Decimal(CASTLE_WHEAT_COST);
            prevTierCostBase = new Decimal(CASTLE_PREV_COST);
            prevTierKey = 'markets';
            break;
        case 'cathedral':
            wheatCostBase = new Decimal(CATHEDRAL_WHEAT_COST);
            prevTierCostBase = new Decimal(CATHEDRAL_PREV_COST);
            prevTierKey = 'castles';
            break;
        case 'citadel':
            wheatCostBase = new Decimal(CITADEL_WHEAT_COST);
            prevTierCostBase = new Decimal(CITADEL_PREV_COST);
            prevTierKey = 'cathedrals';
            break;
        case 'kingdom':
            wheatCostBase = new Decimal(KINGDOM_WHEAT_COST);
            prevTierCostBase = new Decimal(KINGDOM_PREV_COST);
            prevTierKey = 'citadels';
            break;
    }

    // Calculate max affordable based on ALL constraints
    // 1. Wheat
    let maxWheat = current.wheat.div(wheatCostBase).floor();
    if (current.wheat.gte(wheatCostBase) && maxWheat.lt(1)) maxWheat = new Decimal(1);

    // 2. Workers
    let maxWorkers = current.workers.div(workerCostBase).floor();
    if (current.workers.gte(workerCostBase) && maxWorkers.lt(1)) maxWorkers = new Decimal(1);

    // 3. Previous Tier (if applicable)
    let maxPrev = new Decimal(Infinity);
    if (prevTierKey) {
        const prevAmount = current[prevTierKey] as Decimal;
        maxPrev = prevAmount.div(prevTierCostBase).floor();
        if (prevAmount.gte(prevTierCostBase) && maxPrev.lt(1)) maxPrev = new Decimal(1);
    }

    // The limiting factor is the minimum of all maxes
    const maxAffordable = Decimal.min(maxWheat, Decimal.min(maxWorkers, maxPrev));

    let amount = new Decimal(0);

    if (buyMode === '1') {
        amount = new Decimal(1);
    } else {
        const percentage = parseFloat(buyMode) / 100;
        amount = maxAffordable.mul(percentage).floor().max(1);
    }

    if (amount.gt(maxAffordable)) amount = maxAffordable;
    if (maxAffordable.eq(0)) amount = new Decimal(0);

    return {
        amount,
        costs: {
            wheat: amount.max(1).mul(wheatCostBase),
            workers: amount.max(1).mul(workerCostBase),
            prevTier: prevTierKey ? amount.max(1).mul(prevTierCostBase) : new Decimal(0),
            prevTierKey
        },
        canAfford: amount.gt(0)
    };
};
