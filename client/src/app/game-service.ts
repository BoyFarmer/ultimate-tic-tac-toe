import { computed, inject, Injectable, signal } from '@angular/core';
import { SocketService } from './socket.service';

interface Opponent {
  opponentName: string;
  playingAs: 'circle' | 'cross';
}

interface Action {
  boardId: number;
  cellId: number;
}

interface CellState {
  value?: 'circle' | 'cross';
}

interface BoardState {
  cells: Record<number, CellState>
}
interface GameState {
  boards: Record<number, BoardState>
  lastOpponentMove?: [number, number];
}

const winningPatterns:Array<[number, number, number]> = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [1,4,8],
  [2,4,6],
]

function toRecord<T>(data: Array<[number, T]>): Record<number, T> {
  const r: Record<number, T> = {}
  data.forEach(d => {
    r[d[0]] = d[1];
  })
  return r;
}

function emptyBoard(): BoardState {
  return {
    cells: toRecord(Array(9).fill(0).map((v, index) => [index, {} as CellState] as const))
  }
}

function emptyGameState(): GameState {
  return {
    boards: toRecord(Array(9).fill(0).map((v, index) => [index, emptyBoard()] as const))
  }
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  readonly user = signal<string | undefined>(undefined);
  private readonly waitingFor = signal<'opponent' | 'move' | undefined | 'start'>('start');
  readonly gameState = signal(emptyGameState());
  needToFillUserName = computed(() => this.user() === undefined);
  waitingState = this.waitingFor.asReadonly();
  opponentName = signal<string>('');
  playingAs = signal<'cross' | 'circle'>('circle');
  private socket = inject(SocketService);

  constructor() {
    this.socket.onMessage('OpponentFound', (opponent: Opponent) => {
      this.opponentName.set(opponent.opponentName);
      this.playingAs.set(opponent.playingAs);
      this.waitingFor.set(opponent.playingAs === 'cross' ? 'move' : undefined);
    })

    this.socket.onMessage('PlayerMoveFromServer', (opponent: Action) => {
      this.waitingFor.set(undefined);
      this.updateState(opponent.boardId, opponent.cellId, this.playingAs() === 'circle' ? 'cross' : 'circle', true);
    })
  }

  boardState(boardId: number) {
    return this.gameState().boards[boardId];
  }

  requestToPlay(playerName: string) {
    this.user.set(playerName);
    this.waitingFor.set('opponent');
    this.socket.sendMessage('RequestToPlay', {
      playerName,
    });
  }

  action(boardId: number, cellId: number) {
    if (this.waitingState() !== undefined) {
      return;
    }
    const last = this.gameState().lastOpponentMove;
    if (last && last[1] !== boardId) {
      alert('Tu nie')
      return;
    }

    this.updateState(boardId, cellId, this.playingAs());
    this.waitingFor.set('move');
    this.socket.sendMessage('PlayerMoveFromClient', {
      boardId,
      cellId,
    });
  }

  private updateState(boardId: number, cellId: number, shape: 'cross' | 'circle', opponent: boolean = false) {
    this.gameState.update(state => {
      state.boards[boardId].cells[cellId].value = shape;
      return {
        boards: state.boards,
        lastOpponentMove: opponent ? [boardId, cellId] : undefined,
      }
    })
  }
}
