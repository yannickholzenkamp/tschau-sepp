import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Player} from '../../app.types';

@Component({
  selector: 'app-playerscreen',
  templateUrl: './playerscreen.component.html',
  styleUrls: ['./playerscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerscreenComponent {

  @Input()
  players: Player[];

  @Input()
  activePlayer: Player;

  @Input()
  myPlayerId: number;

  @Input()
  showNumberOfCards = false;

}
