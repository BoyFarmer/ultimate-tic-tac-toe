import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { SocketMessage, SocketMessageFromServer } from './messages';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(); // Connect to Socket.IO server
  }

  sendMessage(event: SocketMessage, message: Record<string, unknown>): void {
    this.socket.emit(event, message);
  }

  onMessage<T>(event: SocketMessageFromServer, callback: (message: T) => void): void {
    this.socket.on(event, callback);
  }
}
