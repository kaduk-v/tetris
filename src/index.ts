import './index.html';
import './index.scss';
import { Graphic } from "./graphic";
import { Tetris } from "./tetris";

const root: HTMLElement = document.getElementById('root');
root.appendChild(Graphic.canvas);

const game = new Tetris();

game.init();
game.play();
