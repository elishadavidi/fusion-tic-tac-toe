const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Game state
let players = [];
let board = Array(3).fill(null).map(() => Array(3).fill(null));
let currentPlayer = 'X';

// Function to check for win conditions
function checkWin() {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
            return board[i][0];
        }
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
        if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
            return board[0][i];
        }
    }
    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return board[0][2];
    }
    // Check for tie
    if (!board.flat().includes(null)) {
        return 'tie';
    }
    return null;
}

// WebSocket handling
wss.on('connection', (ws) => {
    console.log('Player connected');

    // Add player to the game
    players.push(ws);

    // Send initial game state
    ws.send(JSON.stringify({ type: 'init', board, currentPlayer }));

    // Handle player moves
    ws.on('message', (message) => {
        const { row, col } = JSON.parse(message);
        if (board[row][col] === null && players.indexOf(ws) === 0) {
            board[row][col] = currentPlayer;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            const winner = checkWin();
            const messageToSend = JSON.stringify({ type: 'update', board, currentPlayer, winner });
            players.forEach(player => player.send(messageToSend));
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('Player disconnected');
        players = players.filter(player => player !== ws);
    });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
