export interface GameState {
  wheat: number;
  peasants: number;
  mills: number;
  stables: number;
  guilds: number;
  markets: number;
  castles: number;
  cathedrals: number;
  citadels: number;
  kingdoms: number;

  totalHarvested: number;         // Trigo
  totalPeasantsGenerated: number; // Camponeses
  totalMillsGenerated: number;    // Moinhos
  totalStablesGenerated: number;  // Estábulos
  totalGuildsGenerated: number;   // Guildas
  totalMarketsGenerated: number;  // Mercados
  totalCastlesGenerated: number;  // Castelos
  totalCathedralsGenerated: number; // Catedrais
  totalCitadelsGenerated: number; // Cidadelas
  totalKingdomsGenerated: number; // Reinos (Gerado por nada ainda/Click futuro ou fim de jogo)
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