import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { GameService } from '../game-service';

@Component({
  selector: 'app-player-name',
  imports: [
    MatInput,
    MatFormField,
    MatLabel,
    MatButton,
    FormsModule
  ],
  templateUrl: './player-name.html',
  styleUrl: './player-name.scss',
})
export class PlayerName {
  private game = inject(GameService);

  submit(name: string) {
    if (name !== '' && name != null) {
      this.game.requestToPlay(name);
    }
  }
}
