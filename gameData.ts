import Decimal from 'break_infinity.js';
import {
    WheatIcon, PeasantIcon, MillIcon, StableIcon,
    GuildIcon, MarketIcon, CastleIcon, CathedralIcon, CitadelIcon, KingdomIcon,
    EmpireIcon, DynastyIcon, PantheonIcon,
    PlaneIcon, GalaxyIcon, UniverseIcon, MultiverseIcon
} from './components/Icons';
import { GameState, GeneratorType, SkillNode } from './types';

// --- TYPES ---
export type BuyMode = '1' | '1%' | '10%' | '50%' | '100%';

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
export const EMPIRE_WHEAT_COST = 10000000000;
export const DYNASTY_WHEAT_COST = 100000000000;
export const PANTHEON_WHEAT_COST = 1000000000000;
export const PLANE_WHEAT_COST = 10000000000000;
export const GALAXY_WHEAT_COST = 100000000000000;
export const UNIVERSE_WHEAT_COST = 1000000000000000;
export const MULTIVERSE_WHEAT_COST = 10000000000000000;

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
export const EMPIRE_PREV_COST = 95;
export const DYNASTY_PREV_COST = 105;
export const PANTHEON_PREV_COST = 115;
export const PLANE_PREV_COST = 125;
export const GALAXY_PREV_COST = 135;
export const UNIVERSE_PREV_COST = 145;
export const MULTIVERSE_PREV_COST = 155;

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
export const EMPIRE_DURATION_MS = 150000;
export const DYNASTY_DURATION_MS = 180000;
export const PANTHEON_DURATION_MS = 240000;
export const PLANE_DURATION_MS = 300000;
export const GALAXY_DURATION_MS = 360000;
export const UNIVERSE_DURATION_MS = 420000;
export const MULTIVERSE_DURATION_MS = 480000;

export const WHEAT_PER_HARVEST = 3;
export const PEASANTS_PER_MILL_CYCLE = 4;
export const MILLS_PER_STABLE_CYCLE = 5;
export const STABLES_PER_GUILD_CYCLE = 6;
export const GUILDS_PER_MARKET_CYCLE = 7;
export const MARKETS_PER_CASTLE_CYCLE = 8;
export const CASTLES_PER_CATHEDRAL_CYCLE = 9;
export const CATHEDRALS_PER_CITADEL_CYCLE = 10;
export const CITADELS_PER_KINGDOM_CYCLE = 11;
export const KINGDOMS_PER_EMPIRE_CYCLE = 12;
export const EMPIRES_PER_DYNASTY_CYCLE = 13;
export const DYNASTIES_PER_PANTHEON_CYCLE = 14;
export const PANTHEONS_PER_PLANE_CYCLE = 15;
export const PLANES_PER_GALAXY_CYCLE = 16;
export const GALAXIES_PER_UNIVERSE_CYCLE = 17;
export const UNIVERSES_PER_MULTIVERSE_CYCLE = 18;

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
    empires: new Decimal(0),
    dynasties: new Decimal(0),
    pantheons: new Decimal(0),
    planes: new Decimal(0),
    galaxies: new Decimal(0),
    universes: new Decimal(0),
    multiverses: new Decimal(0),

    unlockedSkills: [],

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
    totalEmpiresGenerated: new Decimal(0),
    totalDynastiesGenerated: new Decimal(0),
    totalPantheonsGenerated: new Decimal(0),
    totalPlanesGenerated: new Decimal(0),
    totalGalaxiesGenerated: new Decimal(0),
    totalUniversesGenerated: new Decimal(0),
    totalMultiversesGenerated: new Decimal(0),


};

export const AUTOMATION_THRESHOLD = 5;

// --- LISTS & MAPS ---
export const GENERATOR_ORDER: GeneratorType[] = [
    'peasant', 'mill', 'stable', 'guild', 'market',
    'castle', 'cathedral', 'citadel', 'kingdom',
    'empire', 'dynasty', 'pantheon',
    'plane', 'galaxy', 'universe', 'multiverse'
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
    kingdom: 'kingdoms',
    empire: 'empires',
    dynasty: 'dynasties',
    pantheon: 'pantheons',
    plane: 'planes',
    galaxy: 'galaxies',
    universe: 'universes',
    multiverse: 'multiverses'
};

// --- SKILL TREE DATA ---
export const SKILL_TREE: SkillNode[] = [
    // CENTER - PEASANT
    {
        id: 'peasant_eff_1',
        name: 'Foices de Aço',
        description: 'Dobra a quantidade de trigo colhido.',
        x: 0,
        y: 0,
        connections: ['peasant_spd_1', 'mill_eff_1'],
        cost: new Decimal(100),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'peasant', value: 2 },
        icon: PeasantIcon
    },
    {
        id: 'peasant_spd_1',
        name: 'Botas Leves',
        description: 'Dobra a velocidade de movimento dos camponeses.',
        x: 0,
        y: 100,
        connections: ['peasant_eff_1'],
        cost: new Decimal(250),
        costType: 'wheat',
        effect: { type: 'speed', target: 'peasant', value: 2 },
        icon: PeasantIcon
    },
    // LEFT - MILL
    {
        id: 'mill_eff_1',
        name: 'Velas Reforçadas',
        description: 'Dobra a atração de camponeses.',
        x: -100,
        y: 0,
        connections: ['peasant_eff_1', 'mill_spd_1'],
        cost: new Decimal(1000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'mill', value: 2 },
        icon: MillIcon
    },
    {
        id: 'mill_spd_1',
        name: 'Engrenagens Óleadas',
        description: 'Moinhos giram 2x mais rápido.',
        x: -200,
        y: 0,
        connections: ['mill_eff_1'],
        cost: new Decimal(2500),
        costType: 'wheat',
        effect: { type: 'speed', target: 'mill', value: 2 },
        icon: MillIcon
    },
    // RIGHT - STABLE
    {
        id: 'stable_eff_1',
        name: 'Cavalos de Tração',
        description: 'Transporta materiais para 2x mais moinhos.',
        x: 100,
        y: 0,
        connections: ['peasant_eff_1', 'stable_spd_1'],
        cost: new Decimal(10000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'stable', value: 2 },
        icon: StableIcon
    },
    {
        id: 'stable_spd_1',
        name: 'Estradas Pavimentadas',
        description: 'Viagens logísticas 2x mais rápidas.',
        x: 200,
        y: 0,
        connections: ['stable_eff_1'],
        cost: new Decimal(25000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'stable', value: 2 },
        icon: StableIcon
    },
    // GUILD (Top Right)
    {
        id: 'guild_eff_1',
        name: 'Sindicatos Organizados',
        description: 'Guildas produzem 2x mais estábulos.',
        x: 100,
        y: -100,
        connections: ['peasant_eff_1', 'guild_spd_1'],
        cost: new Decimal(50000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'guild', value: 2 },
        icon: GuildIcon
    },
    {
        id: 'guild_spd_1',
        name: 'Rotas Comerciais',
        description: 'Guildas operam 2x mais rápido.',
        x: 200,
        y: -100,
        connections: ['guild_eff_1'],
        cost: new Decimal(100000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'guild', value: 2 },
        icon: GuildIcon
    },
    // MARKET (Bottom Right)
    {
        id: 'market_eff_1',
        name: 'Feiras Livres',
        description: 'Mercados geram 2x mais guildas.',
        x: 100,
        y: 100,
        connections: ['peasant_eff_1', 'market_spd_1'],
        cost: new Decimal(500000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'market', value: 2 },
        icon: MarketIcon
    },
    {
        id: 'market_spd_1',
        name: 'Leilões Rápidos',
        description: 'Mercados operam 2x mais rápido.',
        x: 200,
        y: 100,
        connections: ['market_eff_1'],
        cost: new Decimal(1000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'market', value: 2 },
        icon: MarketIcon
    },
    // CASTLE (Bottom Left)
    {
        id: 'castle_eff_1',
        name: 'Muralhas de Pedra',
        description: 'Castelos decretam 2x mais mercados.',
        x: -100,
        y: 100,
        connections: ['peasant_eff_1', 'castle_spd_1'],
        cost: new Decimal(5000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'castle', value: 2 },
        icon: CastleIcon
    },
    {
        id: 'castle_spd_1',
        name: 'Arautos Reais',
        description: 'Castelos operam 2x mais rápido.',
        x: -200,
        y: 100,
        connections: ['castle_eff_1'],
        cost: new Decimal(10000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'castle', value: 2 },
        icon: CastleIcon
    },
    // CATHEDRAL (Top Left)
    {
        id: 'cathedral_eff_1',
        name: 'Vitrais Divinos',
        description: 'Catedrais inspiram 2x mais castelos.',
        x: -100,
        y: -100,
        connections: ['peasant_eff_1', 'cathedral_spd_1'],
        cost: new Decimal(50000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'cathedral', value: 2 },
        icon: CathedralIcon
    },
    {
        id: 'cathedral_spd_1',
        name: 'Peregrinações',
        description: 'Catedrais operam 2x mais rápido.',
        x: -200,
        y: -100,
        connections: ['cathedral_eff_1'],
        cost: new Decimal(100000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'cathedral', value: 2 },
        icon: CathedralIcon
    },
    // CITADEL (Top)
    {
        id: 'citadel_eff_1',
        name: 'Torres de Vigia',
        description: 'Cidadelas protegem 2x mais catedrais.',
        x: 0,
        y: -200,
        connections: ['guild_eff_1', 'cathedral_eff_1', 'citadel_spd_1'],
        cost: new Decimal(500000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'citadel', value: 2 },
        icon: CitadelIcon
    },
    {
        id: 'citadel_spd_1',
        name: 'Mobilização Militar',
        description: 'Cidadelas operam 2x mais rápido.',
        x: 0,
        y: -300,
        connections: ['citadel_eff_1'],
        cost: new Decimal(1000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'citadel', value: 2 },
        icon: CitadelIcon
    },
    // KINGDOM (Bottom)
    {
        id: 'kingdom_eff_1',
        name: 'Burocracia Real',
        description: 'Reinos administram 2x mais cidadelas.',
        x: 0,
        y: 400,
        connections: ['market_eff_1', 'castle_eff_1', 'kingdom_spd_1'],
        cost: new Decimal(5000000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'kingdom', value: 2 },
        icon: KingdomIcon
    },
    {
        id: 'kingdom_spd_1',
        name: 'Decretos Reais',
        description: 'Reinos operam 2x mais rápido.',
        x: 0,
        y: 500,
        connections: ['kingdom_eff_1'],
        cost: new Decimal(10000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'kingdom', value: 2 },
        icon: KingdomIcon
    },
    // EMPIRE (Far Left)
    {
        id: 'empire_eff_1',
        name: 'Colônias Distantes',
        description: 'Impérios expandem 2x mais reinos.',
        x: -500,
        y: 0,
        connections: ['mill_spd_1', 'empire_spd_1'],
        cost: new Decimal(50000000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'empire', value: 2 },
        icon: EmpireIcon
    },
    {
        id: 'empire_spd_1',
        name: 'Estradas Imperiais',
        description: 'Impérios operam 2x mais rápido.',
        x: -600,
        y: 0,
        connections: ['empire_eff_1'],
        cost: new Decimal(100000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'empire', value: 2 },
        icon: EmpireIcon
    },
    // DYNASTY (Far Right)
    {
        id: 'dynasty_eff_1',
        name: 'Linhagem Pura',
        description: 'Dinastias perpetuam 2x mais impérios.',
        x: 500,
        y: 0,
        connections: ['stable_spd_1', 'dynasty_spd_1'],
        cost: new Decimal(500000000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'dynasty', value: 2 },
        icon: DynastyIcon
    },
    {
        id: 'dynasty_spd_1',
        name: 'Sucessão Rápida',
        description: 'Dinastias operam 2x mais rápido.',
        x: 600,
        y: 0,
        connections: ['dynasty_eff_1'],
        cost: new Decimal(1000000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'dynasty', value: 2 },
        icon: DynastyIcon
    },
    // PANTHEON (Top Left Outer)
    {
        id: 'pantheon_eff_1',
        name: 'Adoração em Massa',
        description: 'Panteões elevam 2x mais dinastias.',
        x: -500,
        y: -100,
        connections: ['cathedral_spd_1', 'pantheon_spd_1'],
        cost: new Decimal(5000000000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'pantheon', value: 2 },
        icon: PantheonIcon
    },
    {
        id: 'pantheon_spd_1',
        name: 'Milagres Constantes',
        description: 'Panteões operam 2x mais rápido.',
        x: -600,
        y: -100,
        connections: ['pantheon_eff_1'],
        cost: new Decimal(10000000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'pantheon', value: 2 },
        icon: PantheonIcon
    },
    // PLANE (Top Right Outer)
    {
        id: 'plane_eff_1',
        name: 'Convergência Etérea',
        description: 'Planos manifestam 2x mais panteões.',
        x: 500,
        y: -100,
        connections: ['guild_spd_1', 'plane_spd_1'],
        cost: new Decimal(50000000000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'plane', value: 2 },
        icon: PlaneIcon
    },
    {
        id: 'plane_spd_1',
        name: 'Fluxo Dimensional',
        description: 'Planos operam 2x mais rápido.',
        x: 600,
        y: -100,
        connections: ['plane_eff_1'],
        cost: new Decimal(100000000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'plane', value: 2 },
        icon: PlaneIcon
    },
    // GALAXY (Bottom Right Outer)
    {
        id: 'galaxy_eff_1',
        name: 'Expansão Estelar',
        description: 'Galáxias formam 2x mais planos.',
        x: 500,
        y: 100,
        connections: ['market_spd_1', 'galaxy_spd_1'],
        cost: new Decimal(500000000000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'galaxy', value: 2 },
        icon: GalaxyIcon
    },
    {
        id: 'galaxy_spd_1',
        name: 'Velocidade da Luz',
        description: 'Galáxias operam 2x mais rápido.',
        x: 600,
        y: 100,
        connections: ['galaxy_eff_1'],
        cost: new Decimal(1000000000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'galaxy', value: 2 },
        icon: GalaxyIcon
    },
    // UNIVERSE (Bottom Left Outer)
    {
        id: 'universe_eff_1',
        name: 'Teoria do Tudo',
        description: 'Universos contêm 2x mais galáxias.',
        x: -500,
        y: 100,
        connections: ['castle_spd_1', 'universe_spd_1'],
        cost: new Decimal(5000000000000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'universe', value: 2 },
        icon: UniverseIcon
    },
    {
        id: 'universe_spd_1',
        name: 'Big Bang Cíclico',
        description: 'Universos operam 2x mais rápido.',
        x: -600,
        y: 100,
        connections: ['universe_eff_1'],
        cost: new Decimal(10000000000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'universe', value: 2 },
        icon: UniverseIcon
    },
    // MULTIVERSE (Top Outer)
    {
        id: 'multiverse_eff_1',
        name: 'Realidades Infinitas',
        description: 'Multiversos geram 2x mais universos.',
        x: 0,
        y: -600,
        connections: ['citadel_spd_1', 'multiverse_spd_1'],
        cost: new Decimal(50000000000000000),
        costType: 'wheat',
        effect: { type: 'efficiency', target: 'multiverse', value: 2 },
        icon: MultiverseIcon
    },
    {
        id: 'multiverse_spd_1',
        name: 'Onipresença',
        description: 'Multiversos operam 2x mais rápido.',
        x: 0,
        y: -700,
        connections: ['multiverse_eff_1'],
        cost: new Decimal(100000000000000000),
        costType: 'wheat',
        effect: { type: 'speed', target: 'multiverse', value: 2 },
        icon: MultiverseIcon
    },
    // PEASANT LUCK
    {
        id: 'peasant_luck_1',
        name: 'Colheita Abençoada',
        description: '10% de chance de colher o dobro de trigo.',
        x: 0,
        y: 200,
        connections: ['peasant_spd_1'],
        cost: new Decimal(500),
        costType: 'wheat',
        effect: { type: 'luck', target: 'peasant', value: 2 },
        icon: PeasantIcon
    },
    // MILL LUCK
    {
        id: 'mill_luck_1',
        name: 'Ventos Favoráveis',
        description: '10% de chance de atrair o dobro de camponeses.',
        x: -300,
        y: 0,
        connections: ['mill_spd_1'],
        cost: new Decimal(5000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'mill', value: 2 },
        icon: MillIcon
    },
    // STABLE LUCK
    {
        id: 'stable_luck_1',
        name: 'Cavalos Premiados',
        description: '10% de chance de transportar o dobro de recursos.',
        x: 300,
        y: 0,
        connections: ['stable_spd_1'],
        cost: new Decimal(50000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'stable', value: 2 },
        icon: StableIcon
    },
    // GUILD LUCK
    {
        id: 'guild_luck_1',
        name: 'Contratos Lucrativos',
        description: '10% de chance de produzir o dobro de estábulos.',
        x: 300,
        y: -100,
        connections: ['guild_spd_1'],
        cost: new Decimal(250000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'guild', value: 2 },
        icon: GuildIcon
    },
    // MARKET LUCK
    {
        id: 'market_luck_1',
        name: 'Grande Demanda',
        description: '10% de chance de gerar o dobro de guildas.',
        x: 300,
        y: 100,
        connections: ['market_spd_1'],
        cost: new Decimal(2500000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'market', value: 2 },
        icon: MarketIcon
    },
    // CASTLE LUCK
    {
        id: 'castle_luck_1',
        name: 'Tesouro Real',
        description: '10% de chance de decretar o dobro de mercados.',
        x: -300,
        y: 100,
        connections: ['castle_spd_1'],
        cost: new Decimal(25000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'castle', value: 2 },
        icon: CastleIcon
    },
    // CATHEDRAL LUCK
    {
        id: 'cathedral_luck_1',
        name: 'Benção Divina',
        description: '10% de chance de inspirar o dobro de castelos.',
        x: -300,
        y: -100,
        connections: ['cathedral_spd_1'],
        cost: new Decimal(250000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'cathedral', value: 2 },
        icon: CathedralIcon
    },
    // CITADEL LUCK
    {
        id: 'citadel_luck_1',
        name: 'Defesas Impenetráveis',
        description: '10% de chance de proteger o dobro de catedrais.',
        x: 0,
        y: -400,
        connections: ['citadel_spd_1'],
        cost: new Decimal(2500000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'citadel', value: 2 },
        icon: CitadelIcon
    },
    // KINGDOM LUCK
    {
        id: 'kingdom_luck_1',
        name: 'Era de Ouro',
        description: '10% de chance de administrar o dobro de cidadelas.',
        x: 0,
        y: 600,
        connections: ['kingdom_spd_1'],
        cost: new Decimal(25000000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'kingdom', value: 2 },
        icon: KingdomIcon
    },
    // EMPIRE LUCK
    {
        id: 'empire_luck_1',
        name: 'Conquista Gloriosa',
        description: '10% de chance de expandir o dobro de reinos.',
        x: -700,
        y: 0,
        connections: ['empire_spd_1'],
        cost: new Decimal(250000000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'empire', value: 2 },
        icon: EmpireIcon
    },
    // DYNASTY LUCK
    {
        id: 'dynasty_luck_1',
        name: 'Herdeiro Prodígio',
        description: '10% de chance de perpetuar o dobro de impérios.',
        x: 700,
        y: 0,
        connections: ['dynasty_spd_1'],
        cost: new Decimal(2500000000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'dynasty', value: 2 },
        icon: DynastyIcon
    },
    // PANTHEON LUCK
    {
        id: 'pantheon_luck_1',
        name: 'Intervenção Divina',
        description: '10% de chance de elevar o dobro de dinastias.',
        x: -700,
        y: -100,
        connections: ['pantheon_spd_1'],
        cost: new Decimal(25000000000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'pantheon', value: 2 },
        icon: PantheonIcon
    },
    // PLANE LUCK
    {
        id: 'plane_luck_1',
        name: 'Sincronicidade',
        description: '10% de chance de manifestar o dobro de panteões.',
        x: 700,
        y: -100,
        connections: ['plane_spd_1'],
        cost: new Decimal(250000000000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'plane', value: 2 },
        icon: PlaneIcon
    },
    // GALAXY LUCK
    {
        id: 'galaxy_luck_1',
        name: 'Supernova',
        description: '10% de chance de formar o dobro de planos.',
        x: 700,
        y: 100,
        connections: ['galaxy_spd_1'],
        cost: new Decimal(2500000000000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'galaxy', value: 2 },
        icon: GalaxyIcon
    },
    // UNIVERSE LUCK
    {
        id: 'universe_luck_1',
        name: 'Entropia Reversa',
        description: '10% de chance de conter o dobro de galáxias.',
        x: -700,
        y: 100,
        connections: ['universe_spd_1'],
        cost: new Decimal(25000000000000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'universe', value: 2 },
        icon: UniverseIcon
    },
    // MULTIVERSE LUCK
    {
        id: 'multiverse_luck_1',
        name: 'Singularidade',
        description: '10% de chance de gerar o dobro de universos.',
        x: 0,
        y: -800,
        connections: ['multiverse_spd_1'],
        cost: new Decimal(250000000000000000),
        costType: 'wheat',
        effect: { type: 'luck', target: 'multiverse', value: 2 },
        icon: MultiverseIcon
    }
];

export const GENERATOR_INFO = {
    peasant: {
        name: "Camponês",
        icon: PeasantIcon,
        flavor: "Um trabalhador humilde e incansável. Com suas mãos calejadas, ele garante que o reino nunca passe fome.",
        costAmount: new Decimal(PEASANT_COST),
        costIcon: WheatIcon,
        costColor: "text-amber-800",
        prodAmount: new Decimal(WHEAT_PER_HARVEST),
        prodIcon: WheatIcon,
        prodColor: "text-amber-800",
        duration: HARVEST_DURATION_MS / 1000,
        colorClass: "text-amber-900",
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
        costColor: "text-slate-500",
        prodAmount: new Decimal(CASTLES_PER_CATHEDRAL_CYCLE),
        prodIcon: CastleIcon,
        prodColor: "text-slate-500",
        duration: CATHEDRAL_DURATION_MS / 1000,
        colorClass: "text-yellow-500",
        totalLabel: "Fortalezas Abençoadas",
        totalKey: "totalCastlesGenerated" as keyof GameState
    },
    citadel: {
        name: "Cidadela Fortificada",
        icon: CitadelIcon,
        flavor: "Uma metrópole impenetrável. Sua proteção absoluta permite erguer catedrais cada vez maiores.",
        costAmount: new Decimal(CITADEL_COST),
        costIcon: CathedralIcon,
        costColor: "text-yellow-500",
        prodAmount: new Decimal(CATHEDRALS_PER_CITADEL_CYCLE),
        prodIcon: CathedralIcon,
        prodColor: "text-yellow-500",
        duration: CITADEL_DURATION_MS / 1000,
        colorClass: "text-orange-800",
        totalLabel: "Templos Erguidos",
        totalKey: "totalCathedralsGenerated" as keyof GameState
    },
    kingdom: {
        name: "Reino Soberano",
        icon: KingdomIcon,
        flavor: "A unificação suprema de todas as terras. O conceito de nação expande as fronteiras, criando novas cidadelas.",
        costAmount: new Decimal(KINGDOM_COST),
        costIcon: CitadelIcon,
        costColor: "text-orange-800",
        prodAmount: new Decimal(CITADELS_PER_KINGDOM_CYCLE),
        prodIcon: CitadelIcon,
        prodColor: "text-orange-800",
        duration: KINGDOM_DURATION_MS / 1000,
        colorClass: "text-blue-900",
        totalLabel: "Império Expandido",
        totalKey: "totalCitadelsGenerated" as keyof GameState
    },
    empire: {
        name: "Império Continental",
        icon: EmpireIcon,
        flavor: "O domínio absoluto sobre vastas regiões. A influência imperial consolida novos reinos sob uma única bandeira.",
        costAmount: new Decimal(EMPIRE_WHEAT_COST),
        costIcon: KingdomIcon,
        costColor: "text-blue-900",
        prodAmount: new Decimal(KINGDOMS_PER_EMPIRE_CYCLE),
        prodIcon: KingdomIcon,
        prodColor: "text-blue-900",
        duration: EMPIRE_DURATION_MS / 1000,
        colorClass: "text-teal-800",
        totalLabel: "Reinos Unificados",
        totalKey: "totalKingdomsGenerated" as keyof GameState
    },
    dynasty: {
        name: "Dinastia Eterna",
        icon: DynastyIcon,
        flavor: "Uma linhagem lendária que atravessa eras. O sangue real garante a estabilidade de múltiplos impérios.",
        costAmount: new Decimal(DYNASTY_WHEAT_COST),
        costIcon: EmpireIcon,
        costColor: "text-teal-800",
        prodAmount: new Decimal(EMPIRES_PER_DYNASTY_CYCLE),
        prodIcon: EmpireIcon,
        prodColor: "text-teal-800",
        duration: DYNASTY_DURATION_MS / 1000,
        colorClass: "text-rose-900",
        totalLabel: "Impérios Fundados",
        totalKey: "totalEmpiresGenerated" as keyof GameState
    },
    pantheon: {
        name: "Panteão Divino",
        icon: PantheonIcon,
        flavor: "A ascensão final. Governantes tornam-se lendas imortais, inspirando o surgimento de novas dinastias.",
        costAmount: new Decimal(PANTHEON_WHEAT_COST),
        costIcon: DynastyIcon,
        costColor: "text-rose-900",
        prodAmount: new Decimal(DYNASTIES_PER_PANTHEON_CYCLE),
        prodIcon: DynastyIcon,
        prodColor: "text-rose-900",
        duration: PANTHEON_DURATION_MS / 1000,
        colorClass: "text-indigo-500",
        totalLabel: "Legados Eternos",
        totalKey: "totalDynastiesGenerated" as keyof GameState
    },
    plane: {
        name: "Plano Etéreo",
        icon: PlaneIcon,
        flavor: "Uma dimensão de pura energia e potencial. A realidade se dobra para acomodar a divindade.",
        costAmount: new Decimal(PLANE_WHEAT_COST),
        costIcon: PantheonIcon,
        costColor: "text-indigo-500",
        prodAmount: new Decimal(PANTHEONS_PER_PLANE_CYCLE),
        prodIcon: PantheonIcon,
        prodColor: "text-indigo-500",
        duration: PLANE_DURATION_MS / 1000,
        colorClass: "text-cyan-600",
        totalLabel: "Panteões Elevados",
        totalKey: "totalPantheonsGenerated" as keyof GameState
    },
    galaxy: {
        name: "Núcleo Galáctico",
        icon: GalaxyIcon,
        flavor: "Um aglomerado de bilhões de estrelas. A gravidade imensa mantém múltiplos planos em órbita.",
        costAmount: new Decimal(GALAXY_WHEAT_COST),
        costIcon: PlaneIcon,
        costColor: "text-cyan-600",
        prodAmount: new Decimal(PLANES_PER_GALAXY_CYCLE),
        prodIcon: PlaneIcon,
        prodColor: "text-cyan-600",
        duration: GALAXY_DURATION_MS / 1000,
        colorClass: "text-violet-600",
        totalLabel: "Planos Criados",
        totalKey: "totalPlanesGenerated" as keyof GameState
    },
    universe: {
        name: "Tecido do Tempo",
        icon: UniverseIcon,
        flavor: "A totalidade do espaço e tempo. Leis físicas são reescritas para dar nascimento a novas galáxias.",
        costAmount: new Decimal(UNIVERSE_WHEAT_COST),
        costIcon: GalaxyIcon,
        costColor: "text-violet-600",
        prodAmount: new Decimal(GALAXIES_PER_UNIVERSE_CYCLE),
        prodIcon: GalaxyIcon,
        prodColor: "text-violet-600",
        duration: UNIVERSE_DURATION_MS / 1000,
        colorClass: "text-fuchsia-600",
        totalLabel: "Galáxias Formadas",
        totalKey: "totalGalaxiesGenerated" as keyof GameState
    },
    multiverse: {
        name: "Existência Infinita",
        icon: MultiverseIcon,
        flavor: "O conjunto de todas as realidades possíveis. Universos nascem e morrem em um piscar de olhos.",
        costAmount: new Decimal(MULTIVERSE_WHEAT_COST),
        costIcon: UniverseIcon,
        costColor: "text-fuchsia-600",
        prodAmount: new Decimal(UNIVERSES_PER_MULTIVERSE_CYCLE),
        prodIcon: UniverseIcon,
        prodColor: "text-fuchsia-600",
        duration: MULTIVERSE_DURATION_MS / 1000,
        colorClass: "text-slate-950",
        totalLabel: "Universos Expandidos",
        totalKey: "totalUniversesGenerated" as keyof GameState
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

export const calculateMultipliers = (type: GeneratorType, unlockedSkills: string[]) => {
    let speedMult = 1;
    let effMult = new Decimal(1);
    let hasLuck = false;

    SKILL_TREE.forEach(node => {
        if (unlockedSkills.includes(node.id) && node.effect.target === type) {
            if (node.effect.type === 'speed') {
                speedMult *= node.effect.value;
            }
            if (node.effect.type === 'efficiency') {
                effMult = effMult.mul(node.effect.value);
            }
            if (node.effect.type === 'luck') {
                hasLuck = true;
            }
        }
    });

    return { speedMult, effMult, hasLuck };
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
        case 'empire':
            wheatCostBase = new Decimal(EMPIRE_WHEAT_COST);
            prevTierCostBase = new Decimal(EMPIRE_PREV_COST);
            prevTierKey = 'kingdoms';
            break;
        case 'dynasty':
            wheatCostBase = new Decimal(DYNASTY_WHEAT_COST);
            prevTierCostBase = new Decimal(DYNASTY_PREV_COST);
            prevTierKey = 'empires';
            break;
        case 'pantheon':
            wheatCostBase = new Decimal(PANTHEON_WHEAT_COST);
            prevTierCostBase = new Decimal(PANTHEON_PREV_COST);
            prevTierKey = 'dynasties';
            break;
        case 'plane':
            wheatCostBase = new Decimal(PLANE_WHEAT_COST);
            prevTierCostBase = new Decimal(PLANE_PREV_COST);
            prevTierKey = 'pantheons';
            break;
        case 'galaxy':
            wheatCostBase = new Decimal(GALAXY_WHEAT_COST);
            prevTierCostBase = new Decimal(GALAXY_PREV_COST);
            prevTierKey = 'planes';
            break;
        case 'universe':
            wheatCostBase = new Decimal(UNIVERSE_WHEAT_COST);
            prevTierCostBase = new Decimal(UNIVERSE_PREV_COST);
            prevTierKey = 'galaxies';
            break;
        case 'multiverse':
            wheatCostBase = new Decimal(MULTIVERSE_WHEAT_COST);
            prevTierCostBase = new Decimal(MULTIVERSE_PREV_COST);
            prevTierKey = 'universes';
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
