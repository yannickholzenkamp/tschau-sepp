import {Component} from '@angular/core';
import {StateService} from '../../state.service';

const HINT_ENTER = 'Bitte gib deinen Namen ein';
const HINT_INVALID = 'Zwischen 1 und 25 Zeichen';
const HINT_LOADING = 'Wird geladen...';

@Component({
  selector: 'app-start-step2',
  templateUrl: './start-step2.component.html',
  styleUrls: ['./start-step2.component.scss']
})
export class StartStep2Component {

  name = '';
  hint = HINT_ENTER;

  constructor(private stateService: StateService) {
  }

  enterGame() {
    if (this.name && this.name.length > 0 && this.name.length <= 25) {
      this.hint = HINT_LOADING;
      this.stateService.enterGame(this.name);
    } else {
      this.hint = HINT_INVALID;
    }
  }
}
