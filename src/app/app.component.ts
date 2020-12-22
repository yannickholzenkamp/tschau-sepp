import {Component} from '@angular/core';
import {AppService} from './app.service';
import {StateService} from './state.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isGameRunning: Observable<boolean>;

  constructor(private stateService: StateService) {
    this.isGameRunning = this.stateService.isGameRunning();
  }

}
