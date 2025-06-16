// client.ts
import { WebSocket } from 'ws';
import readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let ws: WebSocket;
let username: string;

function connect() {
  ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
    rl.question('Tu nombre: ', (name) => {
      username = name.trim();
      if (username) {
        ws.send(JSON.stringify({ type: 'join', username: username }));
        console.log('¡Conectado! Escribe tu mensaje.');
        promptInput();
      } else {
        console.log('Nombre vacío. Adiós.');
        rl.close();
      }
    });
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data.toString());
      if (msg.type === 'message') {
        console.log(`${msg.username}: ${msg.content}`);
      } else if (msg.type === 'server') {
        console.log(`[Servidor]: ${msg.content}`);
      }
      rl.prompt(true);
    } catch (e) { /* Ignorar errores de parseo en la versión básica */ }
  };

  ws.onclose = () => {
    console.log('Desconectado.');
    rl.close();
  };

  ws.onerror = (err) => {
    console.error('Error:', err.message);
    rl.close();
  };
}

function promptInput() {
  rl.question('', (input) => {
    if (input.toLowerCase() === '/exit') {
      ws.close();
      return;
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'message', content: input }));
    }
    promptInput();
  });
}

connect();