import Decimal from 'break_infinity.js';

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

  upgrades: Record<string, number>; // IDs das melhorias compradas -> Rank atual
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
  MANUAL_HARVEST = 'MANUAL_HARVEST'
}