import React, { useState, useEffect } from 'react';
import './App.css';
import useWebSocket from 'react-use-websocket';

function App() {
    const [board, setBoard] = useState([]);
    const [currentTurn, setCurrentTurn] = useState('X');
    const [player, setPlayer] = useState('...');
    const [winner, setWinner] = useState(null);
    const { lastJsonMessage, sendJsonMessage } = useWebSocket('ws://localhost:8080');

    useEffect(() => {
        if (lastJsonMessage) {
            if (lastJsonMessage.type === "init") {
                const {player} = lastJsonMessage;
                setPlayer(player);
            }
            console.log(lastJsonMessage);
            const {board, currentTurn, winner } = lastJsonMessage;
                setBoard(board);
                setCurrentTurn(currentTurn);
                setWinner(winner);
        }
    }, [lastJsonMessage]);

    const handleClick = (row, col) => {
        sendJsonMessage({ type: 'move', row, col , player});
    };

    const renderCell = (row, col) => {
        return (
            <div key={`${row}-${col}`} className="cell" onClick={() => handleClick(row, col)}>
                {board[row][col]}
            </div>
        );
    };

    const renderBoard = () => {
        if (board.length === 0) {
            return <div>Loading...</div>;
        }
        return (
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
                    </div>
                ))}
            </div>
        );
    };

    const renderStatus = () => {
        if (winner) {
            return winner === 'tie' ? 'It\'s a tie!' : `Player ${winner} wins!`;
        } else {
            return `Player ${currentTurn}'s turn`;
        }
    };

    return (
        <div className="App">
            <h1>Tic Tac Toe</h1>
            <h2>You are playing as {player}</h2>
            {renderStatus()}
            {renderBoard()}
        </div>
    );
}

export default App;