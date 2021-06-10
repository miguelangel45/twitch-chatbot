import * as fs from "fs";
import * as util from "util";
const textToSpeech = require('@google-cloud/text-to-speech');
const play = require('play');


process.env.GOOGLE_APPLICATION_CREDENTIALS = './pure-advantage-316317-ddb75fa94648.json';
class ttsModule{
  private client = new textToSpeech.TextToSpeechClient();
  constructor() {
  }

  public async synthChatVoice(message){
    let req = {
      input: {text: message},
      voice: {languageCode: 'es-US', ssmlGender: 'FEMALE'},
      audioConfig: {
        audioEncoding: 'MP3',
      }
    };

    const [response] = await this.client.synthesizeSpeech(req);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`${process.env.PWD}/messages/test.mp3`, response.audioContent, 'binary');
    console.log(`Audio content written to file: ${process.env.PWD}/messages`);
    this.playAudio();
  }

  public playAudio(){
    play.sound(`${process.env.PWD}/messages/test.mp3`);
  }
}

export default ttsModule;
