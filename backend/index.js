import express from 'express';
import http from 'http';
import WebSocketHandler from './business-logic/websocket.js';

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketHandler(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
