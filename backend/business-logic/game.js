export default class TicTacToeGame {
    constructor() {
        this.board = Array(3).fill(null).map(() => Array(3).fill(null));
        this.currentTurn = 'X';
    }

    checkWin() {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] && this.board[i][0] === this.board[i][1] && this.board[i][0] === this.board[i][2]) {
                return this.board[i][0];
            }
        }
        // Check columns
        for (let i = 0; i < 3; i++) {
            if (this.board[0][i] && this.board[0][i] === this.board[1][i] && this.board[0][i] === this.board[2][i]) {
                return this.board[0][i];
            }
        }
        // Check diagonals
        if (this.board[0][0] && this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
            return this.board[0][0];
        }
        if (this.board[0][2] && this.board[0][2] === this.board[1][1] && this.board[0][2] === this.board[2][0]) {
            return this.board[0][2];
        }
        // Check for tie
        if (!this.board.flat().includes(null)) {
            return 'tie';
        }
        return null;
    }

    makeMove (row, col, player) {
        if (!this.board[row][col] && player === this.currentTurn) {
            this.board[row][col] = this.currentTurn;
            const winner = this.checkWin();
            this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';
            return JSON.stringify({type: "update", board: this.getBoard(), player, currentTurn: this.getCurrentTurn(), winner});
        }
        return null;
    }

    getBoard() {
        return this.board;
    }

    getCurrentTurn() {
        return this.currentTurn;
    }
}
