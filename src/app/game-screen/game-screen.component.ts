import {Component, Input} from '@angular/core';
import {StateService} from '../state.service';
import {Card, CardNumber, MatchState, Player} from '../app.types';

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

  @Input()
  round: number;

  requestedStart = false;
  specialHint;
  drawnLastInRound;
  drawnCard = false;

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
      if (this.canPutACardOnTop(card)) {
        if (this.doIHaveMatchingOnTopCards(card)) {
          this.addSpecialHint('Du kannst noch weitere Karten legen.');
        } else {
          this.addSpecialHint('Du dürftest noch weitere Karen legen, hast aber keine passenden.');
          this.stateService.nextPlayer();
        }
      } else {
        this.stateService.nextPlayer();
      }
    }
  }

  private canPutACardOnTop(card: Card) {
    return card.number === CardNumber.ASS ||
      card.number === CardNumber.SECHS;
  }

  private doIHaveMatchingOnTopCards(card: Card) {
    return this.cards.filter(c => c.type === card.type || c.number === card.number).length > 0;
  }

  drawCard() {
    if (this.isMyTurn()) {
      if (this.hasDrawnInThisRound()) {
        this.addSpecialHint('Du hast in dieser Runde schon gezogen.')
      } else {
        this.stateService.drawCard();
        this.drawnCard = true;
        this.drawnLastInRound = this.round;
      }
    } else {
      this.addSpecialHint('Du kannst nur ziehen, wenn du dran bist.');
    }
  }

  hasDrawnInThisRound() {
    return this.drawnLastInRound === this.round && this.drawnCard;
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
