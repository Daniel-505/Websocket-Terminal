import {serve} from "bun";

const clients = new Map<WebSocket, string>();

serve({
    port: 3000,
    websocket: {
        open(ws) {
            console.log('cliente conectado');
        },

        async message(ws, message) {
            try {
                const data = JSON.parse(message.toString());
                if (data.type === 'join' && typeof data.username === 'string') {
                    clients.set(ws, data.username);
                    console.log(`"${data.username}" se ha unido`);
                    broadcast({type: 'server', content: `"${data.username}" se ha unido al chat`}, ws);
                }else if (data.type === 'message' && typeof data.content === 'string') {
                    const username = clients.get(ws) || 'desconocido';
                    console.log(`${username}: ${data.content}`);
                    broadcast({type: 'message', username: username, content: data.content});
                }
            } catch (e) {
                console.error('error al procesar el mensaje.', e.message);
            }
        },

        close(ws) {
            const username = clients.get(ws);
            if (username) {
                clients.delete(ws);
                console.log(`"${username}"ha salido`);
                broadcast({type: 'server', content: `"${username}" se ha salido del chat`});
            } else {
                console.log('usuario desconocido ha salido del chat.');
            }
        },

        error(ws, error) {
            console.error('error de websocket.', error.message);
        }
    },
    fetch(req, server) {
        const success = server.upgrade(req);
        return success ? undefined : new Response('solo conexiones websocket', {status:400});
    }
})

console.log('servidor escuchando en ws://localhost');

function broadcast(message: any, excludeWs?: WebSocket) {
    const messageString = JSON.stringify(message);
    for (const [clientWs] of clients) {
        if (clientWs !== excludeWs && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(messageString);
        }
    }
}