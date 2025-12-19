export type SocketMessage =
  'RequestToPlay'
  | 'PlayerMoveFromClient';


export type SocketMessageFromServer =
  'OpponentFound'
  | 'PlayerMoveFromServer';
