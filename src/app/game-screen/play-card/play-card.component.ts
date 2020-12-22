import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Card, CardType} from '../../app.types';

@Component({
  selector: 'app-play-card',
  templateUrl: './play-card.component.html',
  styleUrls: ['./play-card.component.scss']
})
export class PlayCardComponent {

  @Input()
  card: Card;

  @Input()
  isPuttable = true;

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

  clickCard() {
    this.selectCard.emit(this.card);
  }
}
