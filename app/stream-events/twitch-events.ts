import * as http from "http";
import * as socketIo from 'socket.io';

class TwitchEvents {
  private httpServer;
  private io;
  constructor() {
    this.httpServer = http.createServer();
    /*this.io = socketIo(this.httpServer,{

    })*/
  }
}
