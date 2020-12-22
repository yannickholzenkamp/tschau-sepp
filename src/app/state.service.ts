import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, Observable} from 'rxjs';
import {filter, first, map} from 'rxjs/operators';
import {Card, MatchState, Player} from './app.types';
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
  private _round = new BehaviorSubject<number>(0);

  constructor(private appService: AppService) {
    interval(2000).pipe(
      filter(() => this._isGameRunning.getValue()),
      map(() => this.updateStore()),
    ).subscribe();
  }

  private updateStore(): void {
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
        if (gameMeta.lastDiscardedCard !== this._lastDiscardedCard.getValue()) {
          this._lastDiscardedCard.next(gameMeta.lastDiscardedCard);
        }
        if (gameMeta.round !== this._round.getValue()) {
          this._round.next(gameMeta.round);
        }
        if (true) { // FIXME check diff in cards
          let player = gameMeta.players.filter(player => player.id === this._playerId);
          this._cards.next(player && player[0].cards ? player[0].cards : []);
        }
      }),
      first()
    ).subscribe();
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

  public getGameId(): Observable<string> {
    return this._gameId;
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

  public drawCard(): void {
    this.appService.drawCard(this._gameId.getValue(), this._playerId).pipe(
      map(card => {
        let newState = [...this._cards.getValue(), card];
        this._cards.next(newState);
      }),
      first()
    ).subscribe();
  }

  public putCard(card: Card): void {
    this.appService.putCard(this._gameId.getValue(), this._playerId, card).pipe(
      map(() => {
        let newState = [...this._cards.getValue()];
        let index = newState.findIndex(c => c.type === card.type && c.number === card.number);
        newState.splice(index, 1)
        this._cards.next(newState);
        this.updateStore();
      }),
      first()
    ).subscribe();
  }

  public nextPlayer(): void {
    this.appService.nextPlayer(this._gameId.getValue()).pipe(
      map(() => this.updateStore())
    ).subscribe();
  }
}
