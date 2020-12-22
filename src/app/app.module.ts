import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {StartScreenComponent} from './start-screen/start-screen.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {GameScreenComponent} from './game-screen/game-screen.component';
import {StartStep1Component} from './start-screen/start-step1/start-step1.component';
import {StartStep2Component} from './start-screen/start-step2/start-step2.component';
import {PlayerComponent} from './game-screen/playerscreen/player/player.component';
import {PlayCardComponent} from './game-screen/play-card/play-card.component';
import {PlayCardBackComponent} from './game-screen/play-card-back/play-card-back.component';
import {PlayCardPlaceComponent} from './game-screen/play-card-place/play-card-place.component';
import {HttpClientModule} from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PlayerscreenComponent } from './game-screen/playerscreen/playerscreen.component';
import { GameHintComponent } from './game-screen/game-hint/game-hint.component';
import { GameScreenPageComponent } from './game-screen/game-screen-page.component';

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    GameScreenComponent,
    StartStep1Component,
    StartStep2Component,
    PlayerComponent,
    PlayCardComponent,
    PlayCardBackComponent,
    PlayCardPlaceComponent,
    PlayerscreenComponent,
    GameHintComponent,
    GameScreenPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
