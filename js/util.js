import { DIRECTIONS } from "./board.js";

export const _id = (id) => {
    return document.getElementById(id);
};

export const _class = (className) => {
    return document.getElementsByClassName(className);
};

export const _query = (selector) => {
    return document.querySelector(selector);
};

export const _queryAll = (selector) => {
    return document.querySelectorAll(selector);
};

export const addClass = (element, classNames) => {
    if (typeof classNames == 'string') {
        element.classList.add(...classNames.split(' ').filter(Boolean))
    } else if (Array.isArray(classNames)) {
        element.classList.add(...classNames.filter(Boolean));
    }
}

/**
 * @param {string} tag HTML tag of the element.
 * @param {object} options
 * @param {string} options.className Class name for the element.
 * @param {string} options.style CSS inline style for the element.
 * @returns {HTMLElement}
 */
export const createEle = (tag = 'div', { className, style } = { className: '', style: '' }) => {
    const element = document.createElement(tag);
    if (className) {
        addClass(element, className);
    }
    if (style) {
        element.style = style;
    }
    
    return element;
}

/**
 * @param {number} min Minimum value included in the random number.
 * @param {number} max Maximum value included in the random number.
 * @returns {number}
 */
export const randomBetween = (min, max) => { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const keyCodeToDirection = (keyCode) => {
    if (keyCode === 'ArrowLeft' || keyCode === 'KeyA') {
        return DIRECTIONS.LEFT;
    } else if (keyCode === 'ArrowRight' || keyCode === 'KeyD') {
        return DIRECTIONS.RIGHT;
    } else if (keyCode === 'ArrowDown' || keyCode === 'KeyS') {
        return DIRECTIONS.DOWN;
    } else if (keyCode === 'ArrowUp' || keyCode === 'KeyW') {
        return DIRECTIONS.UP;
    }
}

/**
 * @param {number} ms Time to delay in millisecond.
 * @returns {Promise<void>}
 */
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}