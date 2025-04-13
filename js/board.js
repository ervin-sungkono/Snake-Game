import { _id, createEle, keyCodeToDirection, randomBetween } from "./util.js";
import { getMobileDirection } from "./mobile.js";
import { Snake } from "./snake.js";
import { Food } from "./food.js";

const FOOD_UPGRADE_COUNT = 4; // Every n food consumed sets the next food increase count by 1
const INITIAL_SNAKE_SIZE = 3; // Initial snake size
export const DIRECTIONS = {
    LEFT: {x: -1, y: 0},
    RIGHT: {x: 1, y: 0},
    UP: {x: 0, y: -1},
    DOWN: {x: 0, y: 1}
};
const gameBoard = _id('game-board');
const gameOverEvent = new CustomEvent('gameover');

/**
 * @param {number} rows Number of rows in the board
 * @param {number} cols Number of columns in the board
 * @param {number} size Initial size of the snake
 */
export class Board {
    #rows;
    #cols;
    #cells;

    #snake;
    #food;
    #scoreChangeEvent;

    constructor(rows, cols) {
        this.setBoardSize(rows, cols);
        
        const SNAKE_SPAWN_POS = { x: randomBetween(1, cols), y: randomBetween(1, rows) };
        
        this.#snake = new Snake(INITIAL_SNAKE_SIZE, SNAKE_SPAWN_POS, this.#prefersDirection(SNAKE_SPAWN_POS));
        this.#food = new Food();
        this.score = 0;
        this.running = true;

        this.#updateSnakeParts();
        this.#placeFood();
        this.#addControls();
        this.#addMovement();
    }

    setBoardSize(rows, cols) {
        this.#rows = rows; // Determines the row size of the board
        this.#cols = cols; // Determines the col size of the board

        this.#resetBoard();
        this.#setBoard();
    }

    #isColliding({ x, y }) {
        if(x < 1 || x > this.#cols || y < 1 || y > this.#rows) return true; // Check collision with wall

        const positions = this.#snake.getPositions();
        for(let i = 1; i < positions.length; i++) {
            if(x === positions[i].x && y === positions[i].y) return true; // Check collision with snake parts
        }

        return false;
    }

    #touchesFood({ x, y }) {
        const { x: posX, y: posY } = this.#food.position;
        return (x === posX && y === posY);
    }

    #addScore() {
        this.score += this.#food.increase;
        if(this.#scoreChangeEvent) {
            this.#scoreChangeEvent.detail.score = this.score;
            gameBoard.dispatchEvent(this.#scoreChangeEvent);
        }
    }

    #update() {
        const headPos = this.#snake.updatePosition();

        // Check collision
        if(this.#isColliding(headPos)) {
            this.running = false;
            this.#snake.playDeathAnimation();
            gameBoard.dispatchEvent(gameOverEvent);
            return;
        }

        if(this.#touchesFood(headPos)) {
            this.#snake.addSize(this.#food.increase);
            this.#placeFood();
            this.#addScore();
            if(this.score % FOOD_UPGRADE_COUNT === 0) {
                this.#food.setIncrease(2);
            } else {
                this.#food.setIncrease(1);
            }
        }

        this.#updateSnakeParts();
    }

    #updateSnakeParts() {
        const positions = this.#snake.getPositions();

        this.#snake.getParts().forEach((part, index) => {
            const { x, y } = positions[index];
            _id(`cell-${x + (y - 1) * this.#cols}`).appendChild(part);
        })
    }

    #placeFood() {
        this.running = false; // Ensure that the snake doesn't update position while placing food
        const FOOD_SPAWN_POS = { x: randomBetween(1, this.#cols), y: randomBetween(1, this.#rows) };
        let { x, y } = FOOD_SPAWN_POS;
        
        while(_id(`cell-${x + (y - 1) * this.#cols}`).hasChildNodes()) {
            x++;
            if(x > this.#cols) {
                x = 1;
                y++;
            }
            if(y > this.#rows) {
                y = 1;
            }

            if(x === FOOD_SPAWN_POS.x && y === FOOD_SPAWN_POS.y) break; // Unable to place more food
        }

        this.#food.position = { x, y };

        _id(`cell-${x + (y - 1) * this.#cols}`).appendChild(this.#food.getElement())
        this.running = true;
    }

    #addControls() {
        document.addEventListener('mobileswipe', () => {
            this.#snake.setDirection(getMobileDirection());
        })
        document.addEventListener('keydown', (e) => {
            const direction = keyCodeToDirection(e.code);
            if(direction) {
                e.preventDefault();
                this.#snake.setDirection(direction);
            }
        })
    }

    #addMovement() {
        let currTime;
        const move = (timestamp) => {
            if(!currTime) {
                currTime = timestamp
            }

            const elapsed = timestamp - currTime;

            if(elapsed >= 150) {
                currTime = timestamp;
                if(this.running) this.#update(); // update board
            }
            
            requestAnimationFrame(move);
        }
        requestAnimationFrame(move)
    }

    #prefersDirection(position) {
        const { x } = position;
        return this.#cols - x > x ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
    }

    #resetBoard() {
        gameBoard.innerHTML = '';
    }

    #setBoard() {
        gameBoard.style.setProperty('--row-size', this.#rows);
        gameBoard.style.setProperty('--col-size', this.#cols);

        this.#cells = new Array(this.#cols + 1).fill(new Array(this.#rows + 1));

        for(let row = 1; row <= this.#rows; row++) {
            for(let col = 1; col <= this.#cols; col++) {
                const cell = createEle('div', { className: 'game-cell' });
                cell.id = `cell-${(row - 1) * this.#cols + col}`;

                gameBoard.appendChild(cell);
                this.#cells[col][row] = cell;
            }
        }
    }

    addOnScoreChangeListener(listener) {
        this.#scoreChangeEvent = new CustomEvent('scorechange', {
            detail: {
                score: this.score
            }
        });
        gameBoard.addEventListener('scorechange', listener);
    }

    addOnGameOverListener(listener) {
        gameBoard.addEventListener('gameover', listener);
    }
}