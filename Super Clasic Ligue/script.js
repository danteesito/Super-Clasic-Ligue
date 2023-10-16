document.addEventListener('DOMContentLoaded', function() {
  let currentPlayer = 'River';
  let board = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;
  let playerXName = '';
  let playerOName = '';
  let moveCount = 0;
  let lastMoveIndex = null;

  document.getElementById('startButton').addEventListener('click', startGame);

  function startGame() {
    playerXName = document.getElementById('playerXName').value;
    playerOName = document.getElementById('playerOName').value;
    document.getElementById('playerXName').disabled = true;
    document.getElementById('playerOName').disabled = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('gameContainer').style.display = 'block';
    initializeBoard();
    document.getElementById('currentPlayer').innerText = 'Turno de ' + currentPlayer;
  }

  function initializeBoard() {
    const boardElement = document.getElementById('board');

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.addEventListener('click', handleCellClick);
      boardElement.appendChild(cell);
    }
  }

  function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (board[index] === '' && gameActive) {
      board[index] = currentPlayer;
      cell.style.backgroundImage = `url('${currentPlayer === 'River' ? 'River.png' : 'Boca.png'}')`;
      cell.style.pointerEvents = 'none';
      moveCount++;
      document.getElementById('moveCounter').innerText = 'Movimientos: ' + moveCount;
      lastMoveIndex = index;
      document.getElementById('undoButton').disabled = false;
      const winner = checkWin();
      if (winner) {
        document.getElementById('winnerMessage').innerText = 'Ganó ' + winner;
        document.getElementById('winningPlayer').innerText = winner;
        gameActive = false;
      } else if (board.indexOf('') === -1) {
        document.getElementById('winnerMessage').innerText = 'Empate';
        gameActive = false;
      } else {
        currentPlayer = currentPlayer === 'River' ? 'Boca' : 'River';
        document.getElementById('currentPlayer').innerText = 'Turno de ' + currentPlayer;
      }

      cell.classList.add('selected');
    }
  }

  function unselectCell(index) {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.remove('selected');
  }

  function checkWin() {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === 'River' ? playerXName : playerOName;
      }
    }

    return null;
  }

  function undoMove() {
    if (lastMoveIndex !== null) {
      board[lastMoveIndex] = '';
      const cell = document.querySelector(`[data-index="${lastMoveIndex}"]`);
      cell.style.backgroundImage = '';
      cell.style.pointerEvents = 'auto';
      moveCount--;
      document.getElementById('moveCounter').innerText = 'Movimientos: ' + moveCount;
      lastMoveIndex = null;
      document.getElementById('undoButton').disabled = true;

      unselectCell(lastMoveIndex);
    }
  }

  window.undoMove = undoMove;

  function restartGame() {
    currentPlayer = 'River';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    moveCount = 0;
    lastMoveIndex = null;

    document.getElementById('winnerMessage').innerText = '';
    document.getElementById('winningPlayer').innerText = '';
    document.getElementById('moveCounter').innerText = 'Movimientos: 0';

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    initializeBoard();

    document.getElementById('playerXName').disabled = false;
    document.getElementById('playerOName').disabled = false;
    document.getElementById('startButton').disabled = false;
    document.getElementById('currentPlayer').innerText = 'Turno de ' + currentPlayer;
  }

  window.restartGame = restartGame;
});
