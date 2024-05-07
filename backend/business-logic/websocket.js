import TicTacToeGame from "./game.js";
import {WebSocketServer} from "ws"

export default class WebSocketHandler {
    constructor(server) {
        this.wss = new WebSocketServer({server});
        this.players = {};
        this.game = new TicTacToeGame();

        this.wss.on('connection', this.handleConnection.bind(this));
    }

    handleConnection(ws) {
        console.log('Player connected');
        const player = Object.keys(this.players).length === 0 ? 'X' : 'O';
        this.players[player] = ws;

        ws.send(JSON.stringify({
            type: "init",
            board: this.game.getBoard(),
            player,
            currentTurn: this.game.getCurrentTurn(),
            winner: this.game.checkWin()
        }));

        ws.on('message', (message) => {
            const {row, col, player} = JSON.parse(message);
            const result = this.game.makeMove(row, col, player);
            this.broadcast(result);
        });

        ws.on('close', () => {
            console.log('Player disconnected');
        });
    }

    broadcast(messageToSend) {
        this.wss.clients.forEach(client => {
            client.send(messageToSend);
        });
    }
}
