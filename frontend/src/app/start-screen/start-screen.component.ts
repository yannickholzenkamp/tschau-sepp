import {Component} from '@angular/core';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {StateService} from '../state.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  faGithub = faGithub;
  gameId: Observable<string>;

  constructor(private stateService: StateService) {
    this.gameId = stateService.getGameId();
  }

}
