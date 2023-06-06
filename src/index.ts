import './index.html';
import './index.scss';
import { Tetris } from "./tetris";
import { Graphic } from "./graphic";

const game = new Tetris();

game.init();
game.play();
