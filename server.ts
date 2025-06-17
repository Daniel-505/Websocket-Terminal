import { serve } from "bun";

serve({
  port: 3000,
  websocket: {
    open(ws) {
      console.log("🟢 A WebSocket Connection is OPENED");
      ws.subscribe("server-chat");
    },

    async message(ws, message) {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "join" && typeof data.username === "string") {
          clients.set(ws, data.username);
          console.log(`"${data.username}" se ha unido`);

          ws.publish(
            "server-chat",
            JSON.stringify({
              type: "server",
              content: `"${data.username}" se ha unido al chat`,
            })
          );
        } else if (
          data.type === "message" &&
          typeof data.content === "string"
        ) {
          const username = clients.get(ws) || "desconocido";
          console.log(`${username}: ${data.content}`);

          ws.publish(
            "server-chat", // The topic
            JSON.stringify({
              type: "message",
              username: username,
              content: data.content,
            })
          );
        }
      } catch (e) {
        console.error("❌ Error al procesar el mensaje.", e.message);
      }
    },

    close(ws, code, message) {
      console.log("⏹️ A Websocket Connection is CLOSED");

      const username = clients.get(ws);
      if (username) {
        clients.delete(ws);
      }

      ws.unsubscribe("server-chat");

      const leaveMessage = {
        type: "server",
        content: username
          ? `"${username}" se ha salido del chat`
          : "Un usuario desconocido se ha salido del chat",
      };
      ws.publish("server-chat", JSON.stringify(leaveMessage));
    },

    error(ws, error) {
      console.error("⚠️ Error de websocket.", error.message);
    },
  },
  fetch(req, server) {
    const success = server.upgrade(req);
    return success
      ? undefined
      : new Response("Solo conexiones WebSocket permitidas", { status: 400 });
  },
});

console.log("🚀 Servidor escuchando en ws://localhost:3000");

const clients = new Map<WebSocket, string>();
