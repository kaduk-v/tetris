import './index.html';
import './index.scss';
import { Graphic } from "./graphic";
import { ShapeDot, ShapeI, ShapeJ, ShapeL, ShapeO, ShapeS, ShapeT, ShapeU, ShapeX } from "./shape";
import { Tetris } from "./tetris";
import { Color, Playfield } from "./config";

const root: HTMLElement = document.getElementById('root');
root.appendChild(Graphic.canvas);

const game = new Tetris();

const t = new ShapeT();
const i = new ShapeI();
const o = new ShapeO();
const s = new ShapeS();
const j = new ShapeJ();
const l = new ShapeL();

const dot = new ShapeDot();
const x = new ShapeX();
const u = new ShapeU();

game.shape = t;

game.render();
game.start();