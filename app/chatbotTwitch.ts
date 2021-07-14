import ClientConnection from './connection/connection';
import {GreetingsEnum} from "./enums/greetings";
import {CommandsEnum} from "./enums/commands";
import {PremiumCommandsEnum} from "./enums/commands";
import {Vips} from "./enums/vips";
import ttsModule from "./tts/tts.module";
import {Twitch_emotes} from "./enums/twitch_emotes";

const bot = new ClientConnection;
const tts = new ttsModule();
export class ChatbotTwitch{
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

    if(context['message-type'] == 'chat'){
      console.log(`--> Incoming target: ${target}`);
      console.log(`--> Incoming message: ${msg}`);
      ChatbotTwitch.checkHello(msg.split(' ')[0].toLowerCase(), target, context, msg);
    }
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

  private static sayHello(greeting, target: string, context: any, msj: string){

    if(Object.values(GreetingsEnum).includes(greeting.replace(/[^a-zA-Z ]/g, ""))){
      bot.clientConn.say(target, `¡Bienvenid@ ${context.username} KonCha!, Sigue que atrás hay lugar TehePelo, disfruta del stream `);
      tts.synthChatVoice(`¡Bienvenid@ ${context.username}!, Sigue que atrás hay lugar, disfruta del stream`);
      ChatbotTwitch.checkCommand(msj, context, target);
    } else {
      ChatbotTwitch.checkCommand(msj, context, target);
    }
  }

  public static async checkCommand(word, context, target){
    const command = word.split(' ')[0].toLowerCase();
    if(Object.keys(PremiumCommandsEnum).includes(command) && (context.mod == true || context.username === process.env.CHANNELS)){
      this.launchCommand(word, target, context, true);
    } else if(Object.keys(CommandsEnum).includes(command)){
      this.launchCommand(word, target, context);
    } else {
      const messageArr = word.split(' ');
      await messageArr.forEach((word, key) => {
        if(Twitch_emotes[word]){
          delete messageArr[key];
        }
      })
      word = await messageArr.join(" ");
      if(!context['emote-only'] && !Object.values(GreetingsEnum).includes(command.replace(/[^a-zA-Z ]/g, ""))){
        await tts.synthChatVoice(`${context.username} dice: ${word.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ' [Enlace oculto] ')}`);
      }
    }
  }

  private static launchCommand(word, target, context, privileged?: boolean) {
    const command = word.split(' ')[0].toLowerCase();
    if(command.substr(-1) === '?'){
      bot.clientConn.say(target, ((privileged)?PremiumCommandsEnum[command]:CommandsEnum[command]));
    } else {
      if (word.split(' ')[1]){
        bot.clientConn.say(target, ((privileged)?PremiumCommandsEnum[command]:CommandsEnum[command]).replace('<sender>',context.username).replace('<user>', word.split(' ')[1].toLowerCase().replace('@','')));
      } else {
        bot.clientConn.say(target, ((privileged)?PremiumCommandsEnum[command+'?']:CommandsEnum[command+'?']));
      }
    }
  }
}
