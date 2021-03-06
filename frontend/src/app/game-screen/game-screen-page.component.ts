import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Card, MatchState, Player} from '../app.types';
import {StateService} from '../state.service';

@Component({
  selector: 'app-game-screen-page',
  templateUrl: './game-screen-page.component.html',
  styleUrls: ['./game-screen-page.component.scss']
})
export class GameScreenPageComponent {

  players: Observable<Player[]>;
  activePlayer: Observable<Player>;
  matchState: Observable<MatchState>;
  cards: Observable<Card[]>;
  allDiscarded: Observable<Card[]>;
  lastDiscardedCard: Observable<Card>;
  gameId: Observable<string>;
  round: Observable<number>;
  sevens: Observable<number>;
  winner: Observable<Player>;
  playerId: number;

  constructor(private stateService: StateService) {
    this.players = stateService.getPlayers();
    this.activePlayer = stateService.getActivePlayer();
    this.playerId = stateService.getPlayerId();
    this.gameId = stateService.getGameId();
    this.matchState = stateService.getMatchState();
    this.lastDiscardedCard = stateService.getLastDiscardedCard();
    this.cards = stateService.getCards();
    this.allDiscarded = stateService.getAllDiscarded();
    this.round = stateService.getRound();
    this.sevens = stateService.getSevens();
    this.winner = stateService.getWinner();
  }

}
