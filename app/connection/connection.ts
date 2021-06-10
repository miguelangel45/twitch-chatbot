import ConnectionOptions from '../interfaces/connection';
const tmi = require('tmi.js');

class ClientConnection{

  clientConn: any = new tmi.client(ConnectionOptions.getConnectionOptionsInstance().options)
  constructor() {
  }

}
export default ClientConnection;
