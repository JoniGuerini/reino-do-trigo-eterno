import Decimal from 'break_infinity.js';

export type GeneratorType = 'peasant' | 'mill' | 'stable' | 'guild' | 'market' | 'castle' | 'cathedral' | 'citadel' | 'kingdom' | 'empire' | 'dynasty' | 'pantheon' | 'plane' | 'galaxy' | 'universe' | 'multiverse';

export interface GameState {
  // Recursos
  wheat: Decimal;
  workers: Decimal;


  // Geradores (Quantidade)
  peasants: Decimal;
  mills: Decimal;
  stables: Decimal;
  guilds: Decimal;
  markets: Decimal;
  castles: Decimal;
  cathedrals: Decimal;
  citadels: Decimal;
  kingdoms: Decimal;
  empires: Decimal;
  dynasties: Decimal;
  pantheons: Decimal;
  planes: Decimal;
  galaxies: Decimal;
  universes: Decimal;
  multiverses: Decimal;

  // Estatísticas Totais (para conquistas/multiplicadores futuros)
  totalHarvested: Decimal;
  totalWorkersGenerated: Decimal;
  totalPeasantsGenerated: Decimal;
  totalMillsGenerated: Decimal;
  totalStablesGenerated: Decimal;
  totalGuildsGenerated: Decimal;
  totalMarketsGenerated: Decimal;
  totalCastlesGenerated: Decimal;
  totalCathedralsGenerated: Decimal;
  totalCitadelsGenerated: Decimal;
  totalKingdomsGenerated: Decimal;
  totalEmpiresGenerated: Decimal;
  totalDynastiesGenerated: Decimal;
  totalPantheonsGenerated: Decimal;
  totalPlanesGenerated: Decimal;
  totalGalaxiesGenerated: Decimal;
  totalUniversesGenerated: Decimal;
  totalMultiversesGenerated: Decimal;

  // Skill Tree
  unlockedSkills: string[];


}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  connections: string[];
  cost: Decimal;
  costType: 'wheat' | 'workers' | 'points'; // 'points' could be a future currency, using wheat/workers for now
  effect: {
    type: 'speed' | 'efficiency' | 'unlock' | 'luck';
    target: GeneratorType | 'global';
    value: number;
  };
  icon: any; // React component
}

export enum GameAction {
  HIRE_PEASANT = 'HIRE_PEASANT',
  BUILD_MILL = 'BUILD_MILL',
  BUILD_STABLE = 'BUILD_STABLE',
  BUILD_GUILD = 'BUILD_GUILD',
  BUILD_MARKET = 'BUILD_MARKET',
  BUILD_CASTLE = 'BUILD_CASTLE',
  BUILD_CATHEDRAL = 'BUILD_CATHEDRAL',
  BUILD_CITADEL = 'BUILD_CITADEL',
  BUILD_KINGDOM = 'BUILD_KINGDOM',
  BUILD_EMPIRE = 'BUILD_EMPIRE',
  BUILD_DYNASTY = 'BUILD_DYNASTY',
  BUILD_PANTHEON = 'BUILD_PANTHEON',
  BUILD_PLANE = 'BUILD_PLANE',
  BUILD_GALAXY = 'BUILD_GALAXY',
  BUILD_UNIVERSE = 'BUILD_UNIVERSE',
  BUILD_MULTIVERSE = 'BUILD_MULTIVERSE',
  MANUAL_HARVEST = 'MANUAL_HARVEST'
}