import { createEle } from "./util.js";

const DELAY_ANIMATION = 125; // delay death animation between each parts

export class Snake {
    #size;
    #parts;
    #positions;
    #direction;

    constructor(size, position, direction) {
        this.#size = size;
        this.#positions = new Array(this.#size).fill(position);
        this.#direction = direction;

        this.#create(); // Create snake parts
    }

    #create() {
        this.#parts = [];
        for(let part = 0; part < this.#size; part++) {
            this.#createPart(part);
        }
    }

    #createPart(index) {
        const snakePart = createEle('div', { className: `${index === 0 ? 'snake-head' : ''} snake-part` });

        this.#parts.push(snakePart);
    }

    getParts() {
        return this.#parts;
    }

    addSize(size) {
        for(let i = 0; i < size; i++) {
            this.#positions.push(this.#positions[this.#size - 1]);
            this.#createPart(this.#size++);
        }
    }

    #checkDirection(direction) {
        const { x: posX, y: posY } = this.#positions[0];
        const { x, y } = direction;
        const { x: prevX, y: prevY } = this.#positions[1];
    
        if((posX + x === prevX) && (posY + y === prevY)) return false;
        return true;
    }

    setDirection(direction) {
        if(!this.#checkDirection(direction)) return;
        this.#direction = direction;
    }

    getPositions() {
        return this.#positions;
    }

    updatePosition() {
        this.#positions.pop(); // Remove the last index position

        const newX = this.#positions[0].x + this.#direction.x;
        const newY = this.#positions[0].y + this.#direction.y;
        const newPosition =  {x: newX, y: newY };
        this.#positions.unshift(newPosition); // Insert new position at beginning

        return newPosition;
    }

    async playDeathAnimation() {
        this.#parts.forEach((part, index) => {
            setTimeout(() => {
                part.classList.add('dead');
                setTimeout(() => part.remove(), 1000); // remove part from board
            }, DELAY_ANIMATION * index);
        })
    }
}