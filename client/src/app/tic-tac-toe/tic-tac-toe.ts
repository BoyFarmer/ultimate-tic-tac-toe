import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { GameService } from '../game-service';

@Component({
  selector: 'app-tic-tac-toe',
  imports: [],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.scss',
})
export class TicTacToe {
  private readonly game = inject(GameService);
  readonly boardId = input.required({
    transform: numberAttribute,
  });
  lastOpponentMoveBox = computed(() => {
    const lastMove = this.game.gameState().lastOpponentMove;
    if (lastMove && lastMove[0] === this.boardId()) {
      return lastMove[1];
    }
    return undefined;
  });

  readonly board = computed(() => {
    const b = this.game.boardState(this.boardId());
    return {... b};
  });

  readonly cells = computed(() => {
    const board = this.board();
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(id => {
      return {
        id,
        shape: board.cells[id].value,
      }
    });
  });

  click(cellId: number) {
    this.game.action(this.boardId(), cellId);
  }

}
