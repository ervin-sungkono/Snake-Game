import { Board } from "./board.js";
import { Dialog } from "./dialog.js";
import { _id } from "./util.js";

const ROW_SIZE = 30; // Default row size
const COL_SIZE = 30; // Default col size
const gameScore = _id('game-score');
let currScore = 0;
let highScore = localStorage.getItem('highscore') ?? 0;

const gameOverDialogConfig = {
    title: 'Game Over!',
    confirm: {
        label: 'Start Game',
        onClick: () => {
            gameOverDialog.hide().then(startGame);
        }
    }
}
const gameOverDialog = new Dialog(gameOverDialogConfig);

function saveHighScore() {
    highScore = currScore;
    localStorage.setItem('highscore', currScore);
}

const board = new Board(ROW_SIZE, COL_SIZE);

function addBoardListener() {
    board.addOnScoreChangeListener(e => {
        currScore = e.detail.score;
        gameScore.textContent = `Score: ${e.detail.score}`;
    })
    
    board.addOnGameOverListener(() => {
        if (currScore > highScore) saveHighScore();
        gameOverDialog.setBody(`<p>Would you like to try again?</p><p>Your Score: ${currScore}</p><p>Your High Score: ${highScore}</p>`)
        gameOverDialog.show();
    })
}

function resetScore() {
    currScore = 0;
    gameScore.textContent = `Score: ${currScore}`;
}

function startGame() {
    resetScore();
    board.start();
}

function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("./sw.js")
            .then(registration => {
                console.log("Service Worker registered with scope:", registration.scope);
            })
            .catch(error => console.log("Service worker registration failed: ", error));
    }
}

function initialize() {
    registerServiceWorker();

    const startDialogConfig = {
        title: 'Welcome to Snake Game!',
        body: `<p>Your job is to collect as many food as you can.</p><p>Red food increases snake size by 1, while the blue ones increases the snake size by 2.</p><p>Good luck!</p><p>Your High Score: ${highScore}</p>`,
        confirm: {
            label: 'Start Game',
            onClick: () => {
                startGame();
                startDialog.hide();
            }
        }
    }
    const startDialog = new Dialog(startDialogConfig);
    startDialog.show();

    addBoardListener();
}

initialize();