// נקודת הכניסה: dotenv, loadSecrets, DB, app, Socket.IO, graceful shutdown

const http = require("http");
const fs = require("fs");
const path = require("path");

async function loadEnvOrSecrets() {
  const dotenvPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(dotenvPath)) {
    require("dotenv").config({ path: dotenvPath });
  } else {
    const { loadSecrets } = require("./config/secrets");
    const secrets = await loadSecrets();
    Object.assign(process.env, secrets);
  }
}

(async () => {
  try {
    // טעינת משתני סביבה או סודות
    await loadEnvOrSecrets();

    const env = require("./config/env");
    const { connectDB } = require("./config/db");

    // חיבור ל-MongoDB
    await connectDB();

    // אפליקציה + שרת HTTP
    const app = require("./app");
    const server = http.createServer(app);

    // Socket.IO
    const { Server } = require('socket.io');
    const io = new Server(server, {
        path: '/socket.io',
        cors: {
          origin: 'https://vicherapp.com',
          methods: ['GET', 'POST'],
          credentials: true
        },
        transports: ['websocket', 'polling']
    });



    require("./api/controllers/notification").setIo(io);
    require("./api/controllers/lessons").setIo(io);
    require("./api/controllers/users").setIo(io);

    io.on("connection", (sock) => {
        console.log("Socket.IO client connected:", sock.id);
        console.log('WebSocket Transport:', sock.conn.transport.name);

        sock.conn.on("close", (reason) => {
          console.log(`WebSocket closed: ${reason}`);
        });

        sock.conn.on("error", (err) => {
          console.error("WebSocket error:", err);
        });

        sock.on("disconnect", () => {
          console.log("Socket.IO client disconnected:", sock.id);
        });
    });


    // Start listening

    server.listen(env.PORT, () =>
      console.log(`Server listening on port ${env.PORT}`)
    );

    // Graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down...");
      io.close();
      server.close();
      await require("mongoose").disconnect();
      process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
