export interface GameMeta {
  id: string;
  playerId?: number;
  players?: Player[];
  state: MatchState;
  activePlayer: Player;
  lastDiscardedCard: Card;
}

export enum MatchState {
  CREATED = 'CREATED',
  STARTED = 'STARTED',
  OVER = 'OVER'
}

export interface Player {
  id: number;
  name: string;
  cards: Card[];
}

export interface Card {
  type: CardType;
  number: CardNumber;
}

export enum CardType {
  ROSEN = 'ROSEN',
  SCHELLEN = 'SCHELLEN',
  EICHEL = 'EICHEL',
  SCHILTEN = 'SCHILTEN'
}

export enum CardNumber {
  SECHS = 'SECHS',
  SIEBEN = 'SIEBEN',
  ACHT = 'ACHT',
  NEUN = 'NEUN',
  BANNER = 'BANNER',
  UNDER = 'UNDER',
  OBER = 'OBER',
  KOENIG = 'KOENIG',
  ASS = 'ASS'
}
