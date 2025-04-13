import { createEle } from "./util.js";

export class Food {
    position;
    #element;

    /**
     * @param {number} increase Determines how much the food will increase the snake size
     */
    constructor(position, increase = 1) {
        this.position = position;
        
        this.#create();
        this.setIncrease(increase);
    }

    #create() {
        const food = createEle('div', { className: 'food' });
        
        this.#element = food;
    }

    setIncrease(increase) {
        this.increase = increase;
        this.#element.setAttribute('data-attribute-increase', this.increase);
    }

    getElement() {
        return this.#element;
    }
}