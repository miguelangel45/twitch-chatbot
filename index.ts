import ClientConnection from './app/connection/connection';
import {GreetingsEnum} from "./app/enums/greetings";
import {Vips} from "./app/enums/vips";
import ttsModule from "./app/tts/tts.module";

const bot = new ClientConnection;
const tts = new ttsModule();
class chatbotTwitch{
  private static vips: Array<number> = [];
  constructor() {
    try {
      bot.clientConn.connect();

      bot.clientConn.on('message', this.onMessageHandler);
      bot.clientConn.on('connected', this.onConnectedHandler);

    } catch (e){
      console.log(e);
    }
  }

   async onMessageHandler (target, context, msg, self) {
    if(self) {
      return;
    }

    console.log(`--> Incoming target: ${target}`);
    console.log(`--> Incoming message: ${msg}`);

    const commandName = msg.trim();

    if (commandName === '!dice') {
      const num = await chatbotTwitch.rollDice();
      bot.clientConn.say(target, `You rolled a ${num}`);
      console.log(`* Executed ${commandName} command`);
    }

    chatbotTwitch.checkHello(msg.split(' ')[0].toLowerCase(), target, context, msg);
  }

  onConnectedHandler = (addr, port) =>{
    console.log(`--> Connected to ${addr}: ${port}`)
  }

  private static checkHello(greeting, target, context, msj): void{
    if(Object.keys(Vips).includes(context.username)){
      const user = context.username
      if (!this.vips[user]){
        this.vips[user] = 1
        tts.synthChatVoice(`${Vips[user]}`);
      } else {
        this.sayHello(greeting, target, context, msj);
      }
    }else {
      this.sayHello(greeting, target, context, msj);
    }
  }

  private static sayHello(greeting, target, context, msj){
    if(Object.values(GreetingsEnum).includes(greeting.replace(/[^a-zA-Z ]/g, ""))){
      bot.clientConn.say(target, `¡Bienvenid@ ${context.username} KonCha!, Sigue que atrás hay lugar TehePelo, disfruta del stream `);
      tts.synthChatVoice(`¡Bienvenid@ ${context.username}!, Sigue que atrás hay lugar, disfruta del stream`);
    } else {
      tts.synthChatVoice(`${context.username} dice: ${msj.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ' [Enlace oculto] ')}`);
    }
  }
  private static async rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
  }

}

new chatbotTwitch()
