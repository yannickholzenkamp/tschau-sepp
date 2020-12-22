import {Component, Input} from '@angular/core';
import {StateService} from '../state.service';
import {Card, MatchState, Player} from '../app.types';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent {

  @Input()
  players: Player[];

  @Input()
  activePlayer: Player;

  @Input()
  matchState: MatchState;

  @Input()
  cards: Card[];

  @Input()
  lastDiscardedCard: Card;

  @Input()
  gameId: string;

  @Input()
  playerId: number;

  requestedStart = false;
  specialHint;

  constructor(private stateService: StateService) {
  }

  giveCards() {
    this.requestedStart = true;
    this.stateService.startMatch();
  }

  isCreated() {
    return this.matchState === MatchState.CREATED;
  }

  isStarted() {
    return this.matchState === MatchState.STARTED;
  }

  selectCard(card: Card) {
    if (!this.isMyTurn()) {
      this.addSpecialHint('Du bist leider nicht dran.');
    } else if (!this.isPuttable(card)) {
      this.addSpecialHint('Diese Karte passt leider nicht.');
    } else {
      this.stateService.putCard(card);
    }
  }

  drawCard() {
    this.stateService.drawCard();
  }

  isMyTurn() {
    return this.activePlayer.id === this.playerId
  }

  isPuttable(card: Card) {
    return card.type === this.lastDiscardedCard.type || card.number === this.lastDiscardedCard.number;
  }

  addSpecialHint(hint: string) {
    this.specialHint = hint;
    setTimeout(() => this.specialHint = null, 2500);
  }

}
