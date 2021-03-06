import {Component, Input} from '@angular/core';
import {StateService} from '../state.service';
import {Card, CardNumber, CardType, MatchState, Player} from '../app.types';
import {map} from 'rxjs/operators';

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
  allDiscarded: Card[];

  @Input()
  gameId: string;

  @Input()
  playerId: number;

  @Input()
  round: number;

  @Input()
  sevens: number;

  @Input()
  winner: Player;

  requestedStart = false;
  specialHint;
  drawnLastInRound;
  drawnCards = 0;
  hoverOverDiscarded = false;
  wishMode = false;
  wishCards: Card[] = [
    {type: CardType.ROSEN, number: CardNumber.WUNSCH},
    {type: CardType.EICHEL, number: CardNumber.WUNSCH},
    {type: CardType.SCHELLEN, number: CardNumber.WUNSCH},
    {type: CardType.SCHILTEN, number: CardNumber.WUNSCH}
  ]

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

  isOver() {
    return this.matchState === MatchState.OVER;
  }

  selectCard(card: Card) {
    if (!this.isMyTurn()) {
      this.addSpecialHint('Du bist leider nicht dran.');
    } else if (this.sevens > 0 && card.number != CardNumber.SIEBEN && this.round !== 0 && this.drawnCards < (this.sevens * 2)) {
      let label = this.sevens > 1 ? this.sevens + ' letzten Karten waren 7er.' : 'letzte Karte war eine 7.';
      this.addSpecialHint('Die ' + label + ' Bitte nimm ' + (this.sevens * 2) + ' Karten auf.');
    } else if (!this.isPuttable(card)) {
      this.addSpecialHint('Diese Karte passt leider nicht.');
    } else {
      this.stateService.putCard(card);
      if (card.number === CardNumber.UNDER) {
        this.wishMode = true;
      } else {
        if (this.canPutACardOnTop(card)) {
          if (this.doIHaveMatchingOnTopCards(card)) {
            this.addSpecialHint('Du kannst noch weitere Karten legen.');
          } else {
            this.addSpecialHint('Du dürftest noch weitere Karen legen, hast aber keine passenden.');
            this.stateService.nextPlayer();
          }
        } else if (card.number === CardNumber.SECHS) {
          this.addSpecialHint('Du hast eine 6 gelegt. Der nächste Spieler wird übersprungen.');
          this.stateService.skipPlayer();
        } else {
          this.stateService.nextPlayer();
        }
      }
    }
  }

  private canPutACardOnTop(card: Card) {
    return card.number === CardNumber.ASS;
  }

  private doIHaveMatchingOnTopCards(card: Card) {
    return this.cards
      .filter(c => !(c.type === card.type && c.number === card.number))
      .filter(c => c.type === card.type || c.number === card.number)
      .length > 0;
  }

  drawCard() {
    if (this.isMyTurn()) {
      let allowedDraws = (2 * this.sevens) + 1;
      if (this.drawnLastInRound === this.round && this.drawnCards >= allowedDraws) {
        this.addSpecialHint('Du hast in dieser Runde schon gezogen.')
      } else {
        this.stateService.drawCard().pipe(
          map((card) => {
            this.drawnCards++;
            this.drawnLastInRound = this.round;
            this.continueIfNotPuttable(card);
          })
        ).subscribe();
      }
    } else {
      this.addSpecialHint('Du kannst nur ziehen, wenn du dran bist.');
    }
  }

  continueIfNotPuttable(card: Card) {
    const cardsToCheck = [...this.cards, card];
    if (cardsToCheck.filter(c => this.isPuttable(c)).length < 1) {
      this.addSpecialHint('Du hast leider keine passende Karte');
      this.stateService.nextPlayer();
    }
  }

  isMyTurn() {
    return this.activePlayer.id === this.playerId
  }

  isPuttable(card: Card) {
    return card.number === CardNumber.UNDER || card.type === this.lastDiscardedCard.type || card.number === this.lastDiscardedCard.number;
  }

  addSpecialHint(hint: string) {
    this.specialHint = hint;
    setTimeout(() => this.specialHint = null, 2000);
  }

  reload() {
    window.location.reload();
  }

  get hasMoreThanOneDiscardedCard() {
    return this.allDiscarded && this.allDiscarded.length > 1;
  }

  get beforeLastDiscardedCard() {
    return this.hasMoreThanOneDiscardedCard ? this.allDiscarded[this.allDiscarded.length - 2] : null;
  }

  selectWishCard(card: Card) {
    this.stateService.putCard(card);
    this.wishMode = false;
    this.stateService.nextPlayer();
  }
}
