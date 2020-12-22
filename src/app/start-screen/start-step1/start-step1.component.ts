import {Component, EventEmitter, Output} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {StateService} from '../../state.service';

const HINT_ENTER = 'Bitte ID eingeben';
const HINT_INVALID = 'ID nicht gültig';
const HINT_LOADING = 'ID wird geprüft...';
const HINT_FOUND = 'Spiel gefunden';
const HINT_NOT_FOUND = 'Spiel nicht gefunden';

@Component({
  selector: 'app-start-step1',
  templateUrl: './start-step1.component.html',
  styleUrls: ['./start-step1.component.scss']
})
export class StartStep1Component {

  gameId = '';
  hint = HINT_ENTER;
  enteredValidGameId = false;

  @Output()
  joinSpecificGame: EventEmitter<string> = new EventEmitter();

  constructor(private stateService: StateService) {
  }

  createGame() {
    this.stateService.createGame();
  }

  checkForGame() {
    if (!this.gameId || this.gameId.length !== 5) {
      this.hint = HINT_INVALID;
    } else {
      this.hint = HINT_LOADING;
      this.gameId = this.gameId.toUpperCase();
      this.stateService.isGameExisting(this.gameId).pipe(
        map((exists) => {
          this.hint = exists ? HINT_FOUND : HINT_NOT_FOUND;
          this.enteredValidGameId = exists;
        }),
        first()
      ).subscribe();
    }
  }

  changedId() {
    this.enteredValidGameId = false;
    this.hint = HINT_ENTER;
    if (this.gameId && this.gameId.length === 5) {
      this.checkForGame();
    }
  }

  joinGame() {
    if (this.enteredValidGameId) {
      this.stateService.joinGame(this.gameId)
    }
  }
}
