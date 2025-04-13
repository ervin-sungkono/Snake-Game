import { DIRECTIONS } from "./board.js";
import { _id } from "./util.js";

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
const gameBoard = _id('game-board');

gameBoard.addEventListener('touchstart', function(event) {
    event.preventDefault();
    const { screenX, screenY } = event.touches[0];
    touchstartX = screenX;
    touchstartY = screenY;
}, false);

gameBoard.addEventListener('touchend', function(event) {
    event.preventDefault();
    const { screenX, screenY } = event.changedTouches[0];
    touchendX = screenX;
    touchendY = screenY;
    handleSwipe();
}, false); 

let MOBILE_DIRECTION = 'LEFT';

export const getMobileDirection = () => {
    return DIRECTIONS[MOBILE_DIRECTION];
}

const mobileSwipeEvent = new CustomEvent('mobileswipe');
function handleSwipe() {
    const diffX = Math.abs(touchendX - touchstartX);
    const diffY = Math.abs(touchendY - touchstartY);

    if(diffX > diffY) {
        if (touchendX < touchstartX) {
            MOBILE_DIRECTION = 'LEFT';
        }
        if (touchendX > touchstartX) {
            MOBILE_DIRECTION = 'RIGHT';
        }
    } else {
        if (touchendY < touchstartY) {
            MOBILE_DIRECTION = 'UP';
        }
        if (touchendY > touchstartY) {
            MOBILE_DIRECTION = 'DOWN';
        }
    }

    document.dispatchEvent(mobileSwipeEvent);
}