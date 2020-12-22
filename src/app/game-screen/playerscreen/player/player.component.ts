import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {faCaretUp, faChevronUp, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {

  faUser = faUser;
  faCaretUp = faCaretUp;

  @Input()
  name: string;

  @Input()
  numberOfCards: number;

  @Input()
  showNumberOfCards = false;

  @Input()
  isHighlighted = false;

  @Input()
  isActive = false;

}
