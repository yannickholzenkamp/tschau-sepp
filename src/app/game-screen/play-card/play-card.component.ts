import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Card, CardNumber, CardType} from '../../app.types';

@Component({
  selector: 'app-play-card',
  templateUrl: './play-card.component.html',
  styleUrls: ['./play-card.component.scss']
})
export class PlayCardComponent {

  @Input()
  card: Card;

  @Input()
  isClickable = true;

  @Output()
  selectCard: EventEmitter<Card> = new EventEmitter();

  get imgSrc(): string {
    switch (this.card.type) {
      case CardType.EICHEL:
        return 'assets/eichel.PNG';
      case CardType.ROSEN:
        return 'assets/rosen.PNG';
      case CardType.SCHELLEN:
        return 'assets/schellen.PNG';
      case CardType.SCHILTEN:
        return 'assets/schilten.PNG';
    }
  }

  get isNumberCard(): boolean {
    switch (this.card.number) {
      case CardNumber.SECHS:
      case CardNumber.SIEBEN:
      case CardNumber.ACHT:
      case CardNumber.NEUN:
      case CardNumber.BANNER:
        return true;
      default:
        return false;
    }
  }

  get isBildkarte(): boolean {
    switch (this.card.number) {
      case CardNumber.UNDER:
      case CardNumber.OBER:
      case CardNumber.KOENIG:
      case CardNumber.WUNSCH:
        return true;
      default:
        return false;
    }
  }

  get isAss(): boolean {
    return this.card.number === CardNumber.ASS;
  }

  get cardNumber(): string {
    switch (this.card.number) {
      case CardNumber.SECHS:
        return '6';
      case CardNumber.SIEBEN:
        return '7';
      case CardNumber.ACHT:
        return '8';
      case CardNumber.NEUN:
        return '9';
      case CardNumber.BANNER:
        return '10';
      case CardNumber.UNDER:
        return 'UNDER';
      case CardNumber.OBER:
        return 'OBER';
      case CardNumber.KOENIG:
        return 'KÖNIG';
      case CardNumber.WUNSCH:
        return 'WUNSCH';
    }
  }

  clickCard() {
    this.selectCard.emit(this.card);
  }
}
