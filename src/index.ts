import '@src/index.html';
import '@src/index.scss';
import { Tetris } from "@src/tetris";
import { ShapeDot, ShapeI, ShapeJ, ShapeL, ShapeO, ShapeS, ShapeT, ShapeU, ShapeX } from "@src/shape";

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

game.shape = l;

game.render(true);

// @ts-ignore
window.game = game



