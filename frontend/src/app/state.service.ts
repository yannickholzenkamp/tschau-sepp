import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, Observable} from 'rxjs';
import {catchError, filter, first, map} from 'rxjs/operators';
import {Card, CardNumber, MatchState, Player} from './app.types';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private _isGameRunning = new BehaviorSubject<boolean>(false);
  private _gameId = new BehaviorSubject<string>(null);
  private _playerName: string;
  private _playerId: number;
  private _cards = new BehaviorSubject<Card[]>([]);
  private _players = new BehaviorSubject<Player[]>([]);
  private _activePlayer = new BehaviorSubject<Player>(null);
  private _matchState = new BehaviorSubject<MatchState>(MatchState.CREATED);
  private _lastDiscardedCard = new BehaviorSubject<Card>(null);
  private _allDiscarded = new BehaviorSubject<Card[]>([]);
  private _round = new BehaviorSubject<number>(0);
  private _winner = new BehaviorSubject<Player>(null);
  private _sevens = new BehaviorSubject<number>(0);
  private lastStoreUpdate = 0;
  private reloadActive = true;

  constructor(private appService: AppService) {
    interval(100).pipe(
      filter(() => this._isGameRunning.getValue()),
      filter(() => this.reloadActive),
      map(() => this.updateStore()),
    ).subscribe();
  }

  private updateStore(): void {
    const ageOfLastUpdate = Date.now() - this.lastStoreUpdate;
    if (ageOfLastUpdate < 500) {
      return;
    }

    this.appService.getGame(this._gameId.getValue()).pipe(
      map(gameMeta => {
        if (true) { // FIXME check length of cards and user id
          this._players.next(gameMeta.players);
        }
        if (gameMeta.activePlayer && (!this._activePlayer.getValue() || gameMeta.activePlayer.id !== this._activePlayer.getValue().id)) {
          this._activePlayer.next(gameMeta.activePlayer);
        }
        if (gameMeta.state !== this._matchState.getValue()) {
          this._matchState.next(gameMeta.state)
        }
        if (gameMeta.winner) {
          this._winner.next(gameMeta.winner)
        }
        if (gameMeta.sevens !== this._sevens.getValue()) {
          this._sevens.next(gameMeta.sevens)
        }
        if (gameMeta.lastDiscardedCard !== this._lastDiscardedCard.getValue()) {
          this._lastDiscardedCard.next(gameMeta.lastDiscardedCard);
        }
        if (gameMeta.allDiscarded && gameMeta.allDiscarded.length !== this._allDiscarded.getValue().length) {
          this._allDiscarded.next(gameMeta.allDiscarded);
        }
        if (gameMeta.round !== this._round.getValue()) {
          this._round.next(gameMeta.round);
        }

        let player = gameMeta.players.filter(player => player.id === this._playerId)[0];
        if (!this.areCardsTheSame(player.cards, this._cards.getValue())) {
          this._cards.next(player.cards);
        }

        this.lastStoreUpdate = Date.now();
      }),
      first()
    ).subscribe();
  }

  private areCardsTheSame(a: Card[], b: Card[]) {
    return a && b && a.filter(c => this.isCardInStack(c, b)).length === a.length &&
      b.filter(c => this.isCardInStack(c, a)).length === b.length;
  }

  private isCardInStack(card: Card, stack: Card[]) {
    return stack.filter(c => card.number === c.number && card.type === c.type).length > 0;
  }

  public isGameRunning(): Observable<boolean> {
    return this._isGameRunning;
  }

  public startGame(): void {
    this._isGameRunning.next(true);
  }

  public startMatch(): void {
    this.appService.startGame(this._gameId.getValue()).subscribe();
  }

  public getPlayerId(): number {
    return this._playerId;
  }

  public getPlayers(): Observable<Player[]> {
    return this._players;
  }

  public getRound(): Observable<number> {
    return this._round;
  }

  public getWinner(): Observable<Player> {
    return this._winner;
  }

  public getActivePlayer(): Observable<Player> {
    return this._activePlayer;
  }

  public getMatchState(): Observable<MatchState> {
    return this._matchState;
  }

  public getLastDiscardedCard(): Observable<Card> {
    return this._lastDiscardedCard;
  }

  public getCards(): Observable<Card[]> {
    return this._cards;
  }

  public getAllDiscarded(): Observable<Card[]> {
    return this._allDiscarded;
  }

  public getGameId(): Observable<string> {
    return this._gameId;
  }

  public getSevens(): Observable<number> {
    return this._sevens;
  }

  public createGame(): void {
    this.appService.createGame()
      .pipe(
        map(gameMeta => {
          this._gameId.next(gameMeta.id);
        }),
        first()
      ).subscribe();
  }

  public joinGame(gameId: string): void {
    this._gameId.next(gameId);
  }

  public enterGame(playerName: string): void {
    this.appService.joinGame(this._gameId.getValue(), playerName).pipe(
      map(gameMeta => {
        this._playerId = gameMeta.playerId;
        this.startGame();
      }),
      first()
    ).subscribe();
  }

  public isGameExisting(gameId: string): Observable<boolean> {
    return this.appService.isGameExisting(gameId);
  }

  public drawCard(): Observable<Card> {
    return this.appService.drawCard(this._gameId.getValue(), this._playerId).pipe(
      map(card => {
        let newState = [...this._cards.getValue(), card];
        this._cards.next(newState);
        return card;
      }),
      first()
    );
  }

  public putCard(card: Card): void {
    this.appService.putCard(this._gameId.getValue(), this._playerId, card).pipe(
      map(() => {
        if (card.number !== CardNumber.WUNSCH) {
          let newState = [...this._cards.getValue()];
          let index = newState.findIndex(c => c.type === card.type && c.number === card.number);
          newState.splice(index, 1)
          this._cards.next(newState);
        }
        this._lastDiscardedCard.next(card);
        this.updateStore();
      }),
      first()
    ).subscribe();
  }

  public nextPlayer(): void {
    this.appService.nextPlayer(this._gameId.getValue()).pipe(
      map(() => this.updateStore()),
      first()
    ).subscribe();
  }

  public skipPlayer(): void {
    this.appService.nextPlayer(this._gameId.getValue()).pipe(
      map(() => {
          this.appService.nextPlayer(this._gameId.getValue()).pipe(
            map(() => this.updateStore()),
            first()
          ).subscribe();
        }
      ),
      first()
    ).subscribe();
  }
}
