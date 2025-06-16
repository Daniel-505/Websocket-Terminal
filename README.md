# Websocket-Terminal
Paso a paso:
Clona el Proyecto de GitHub

Abre tu terminal (PowerShell, Símbolo del Sistema o tu terminal de Linux/WSL).
Ve a la carpeta donde quieres guardar el proyecto. Por ejemplo, si lo quieres en tu carpeta de documentos:

cd Doocuments o Documentos

Clona el repositorio usando el comando git clone y la URL de tu repositorio de GitHub:
git clone https://github.com/Daniel-505/Websocket-Terminal.git

Después de clonar, navega a la carpeta del proyecto:

cd Websocket-terminal


Cómo Iniciar tu Chat
Necesitarás Bun instalado y dos ventanas de terminal abiertas.

1. Iniciar el Servidor
Abre tu primera terminal.
Ve a la carpeta del proyecto (donde están server.ts y client.ts):

cd Doocuments o Documentos
cd Websocket-terminal

Inicia el servidor:
bun run server.ts

Verás un mensaje confirmando que el servidor está activo.

2. Iniciar el Cliente
Abre tu segunda terminal (una nueva pestaña o ventana).
Ve a la misma carpeta del proyecto:

cd Doocuments o Documentos
cd Websocket-terminal

Inicia el cliente:

bun run client.ts
El cliente te pedirá tu nombre. ¡Escríbelo y empieza a chatear!

Consejos Rápidos
Siempre inicia el servidor primero.
Para detener cualquiera de los dos (servidor o cliente), presiona Ctrl + C en su terminal.
