import { Component, inject, signal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { GameService } from './game-service';
import { PlayerName } from './player-name/player-name';
import { SocketService } from './socket.service';
import { TicTacToe } from './tic-tac-toe/tic-tac-toe';
import { Waiting } from './waiting/waiting';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    TicTacToe,
    PlayerName,
    Waiting,
    MatProgressBar
  ],
  styleUrl: './app.scss'
})
export class App {
  private game = inject(GameService);
  readonly needToFillUserName = this.game.needToFillUserName;
  readonly waitingState = this.game.waitingState;
  readonly opponentName = this.game.opponentName;
  readonly playingAs = this.game.playingAs;
  readonly user = this.game.user;
}
