import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Card, GameMeta} from './app.types';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

const BASE_URL = 'http://yannick-tschau-sepp-backend.apps.okd.baloise.dev/api';
const CREATE_GAME = BASE_URL + '/games/create';
const GET_GAME = BASE_URL + '/games/{id}';
const JOIN_GAME = BASE_URL + '/games/{id}/join';
const START_GAME = BASE_URL + '/games/{id}/start';
const CARD = BASE_URL + '/games/{id}/cards';
const NEXT_PLAYER = BASE_URL + '/games/{id}/next';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {
  }

  public createGame(): Observable<GameMeta> {
    return this.http.get<GameMeta>(CREATE_GAME);
  }

  public isGameExisting(gameId: string): Observable<boolean> {
    const url = GET_GAME.replace('{id}', gameId);
    return this.http.get<GameMeta>(url).pipe(
      map(() => true),
      catchError((err) => of(false))
    );
  }

  public getGame(gameId: string): Observable<GameMeta> {
    const url = GET_GAME.replace('{id}', gameId);
    return this.http.get<GameMeta>(url);
  }

  public joinGame(gameId: string, playerName: string): Observable<GameMeta> {
    const url = JOIN_GAME.replace('{id}', gameId);
    return this.http.get<GameMeta>(url, {params: {name: playerName}});
  }

  public startGame(gameId: string): Observable<GameMeta> {
    const url = START_GAME.replace('{id}', gameId);
    return this.http.get<GameMeta>(url);
  }

  public nextPlayer(gameId: string): Observable<GameMeta> {
    const url = NEXT_PLAYER.replace('{id}', gameId);
    return this.http.get<GameMeta>(url);
  }

  public drawCard(gameId: string, playerId: number): Observable<Card> {
    const url = CARD.replace('{id}', gameId);
    return this.http.get<Card>(url, {params: {player: playerId.toString()}});
  }

  public putCard(gameId: string, playerId: number, card: Card): Observable<GameMeta> {
    const url = CARD.replace('{id}', gameId);
    return this.http.post<GameMeta>(url, card, {params: {player: playerId.toString()}});
  }
}
