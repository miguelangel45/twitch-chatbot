import * as fs from "fs";
import * as util from "util";
const textToSpeech = require('@google-cloud/text-to-speech');
const play = require('sound-play');
import {of} from 'rxjs';
const mp3Duration = require('mp3-duration');


process.env.GOOGLE_APPLICATION_CREDENTIALS = './pure-advantage-316317-ddb75fa94648.json';
class ttsModule{
  private client = new textToSpeech.TextToSpeechClient();
  private list;
  private playList;
  constructor() {
    this.list = [];
    this.playList = of(this.list);

  }

  public async synthChatVoice(message){
    try{
      let req = {
        input: {text: message},
        voice: {languageCode: 'es-US', ssmlGender: 'FEMALE'},
        audioConfig: {
          audioEncoding: 'MP3',
        }
      };

      const [response] = await this.client.synthesizeSpeech(req);
      const writeFile = util.promisify(fs.writeFile);
      const audioRoute = `${process.env.PWD}/messages/${Date.now()}.mp3`;
      await writeFile(audioRoute, response.audioContent, 'binary');
      console.log(`Audio content written to file: ${process.env.PWD}/messages`);
      mp3Duration(audioRoute, async (err, duration) => {
        await this.playAudio({audio: audioRoute, played: false, duration: duration * 1000});
        const sab = new SharedArrayBuffer(1024);
        const int32 = new Int32Array(sab);
        Atomics.wait(int32, 0, 0, duration * 1000);
      })

    } catch (e){
      console.log('error in synthChatVoice',e);
    }
  }

  public async playAudio(audio){

    play.play(audio.audio, ()=>{
      audio.played = true;
    }).then(() =>{
      console.log('played');
    });
  }
}

export default ttsModule;
