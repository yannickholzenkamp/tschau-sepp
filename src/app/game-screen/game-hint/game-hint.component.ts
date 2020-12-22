import {Component, Input} from '@angular/core';
import {Player} from '../../app.types';

@Component({
  selector: 'app-game-hint',
  templateUrl: './game-hint.component.html',
  styleUrls: ['./game-hint.component.scss']
})
export class GameHintComponent {

  @Input()
  activePlayer: Player;

  @Input()
  myPlayerId: number;

  @Input()
  specialHint: string;


  get gameHint() {
    if (this.specialHint) {
      return this.specialHint;
    } else if (this.activePlayer.id === this.myPlayerId) {
      return 'Du bist dran';
    } else {
      return this.activePlayer.name + ' ist dran (' + this.activePlayer.cards.length + ' Karten)';
    }
  }

}
