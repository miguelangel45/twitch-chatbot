import {createServer} from "http";
import {Server, Socket} from 'socket.io';

export class TwitchEvents {
  public httpServer;
  private io;
  constructor() {

  }

  public connection(){
    this.httpServer = createServer();
    this.io = new Server(this.httpServer,{
      path: "/command-alerts/",
      cors:{
        origin:['*'],
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"]
      }
    });
    this.io.on('connection', (socket: Socket) => {
      console.log('Connected');
      console.log(socket);
      socket.emit('hello-server', 'Hi from server');
    });
    this.httpServer.listen(6000);
    console.log('hello from connection');
    this.io.on('hello-client', () => {
      console.log('hello');
    })
    this.io.on("disconnect", (reason) => {
      console.log(reason); // "ping timeout"
    });
  }

  public emitCommand(command){
    console.log(command);
    return command;
  }
}
