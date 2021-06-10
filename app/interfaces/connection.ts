
const dotenv = require('dotenv');

interface connection{
  identity: identity
  channels: Array<string>;
}

interface identity {
  username: string;
  password: string;
}

class ConnectionOptions{
  private static instance: PrivateConnectionOptions;
  constructor() {
    throw new Error('Use getConnectionOptionsInstance instead');
  }

  public static getConnectionOptionsInstance(){
    if(!ConnectionOptions.instance){
      ConnectionOptions.instance = new PrivateConnectionOptions();
    }
    return ConnectionOptions.instance;
  }
}

class PrivateConnectionOptions{
  public options: connection;
  constructor() {
    dotenv.config();
    this.options = {
      identity: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD, //tif5tily9sfzbcpunmd0mv5nnsmgfk
      },
      channels: [
        process.env.CHANNELS
      ]
    }
  }
}

export default ConnectionOptions;
