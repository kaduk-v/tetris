import './index.html';
import './index.scss';
import { Tetris } from "./tetris";

const game = new Tetris();

game.init();
game.play();
