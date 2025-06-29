import makeWASocket, { useSingleFileAuthState, DisconnectReason } from '@adiwajshing/baileys';
import { Boom } from '@hapi/boom';
import { EventEmitter } from 'events';

export class SessionManager extends EventEmitter {
  constructor() {
    super();
    this.sock = null;
  }

  async start() {
    this.sock = makeWASocket({
      printQRInTerminal: false,
      auth: useSingleFileAuthState(`auth_info.json`), // stocke la session localement temporairement
    });

    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) this.emit('qr', qr);

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        if (statusCode !== DisconnectReason.loggedOut) {
          this.start();
        }
      }

      if (connection === 'open') {
        this.emit('connected');
      }
    });

    this.sock.ev.on('creds.update', () => {
      // la session s'auto-save
    });
  }
}
