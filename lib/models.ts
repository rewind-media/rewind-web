import {Socket} from "socket.io-client";
import {ClientToServerEvents, Library, ServerToClientEvents} from "@rewind-media/rewind-protocol";

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface PropsWithSocket {
  socket: SocketClient;
}

export interface PropsWithLibrary {
  library: Library;
}
