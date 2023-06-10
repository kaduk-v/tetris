import './index.html';
import './index.scss';
import { Tetris } from "./tetris";

const game = new Tetris();

try {
    game.init();
    game.play();
} catch (e) {
    console.error(e);
}

