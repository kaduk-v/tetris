import './index.html';
import './index.scss';
import { Tetris } from "./tetris";
import { ShapeDot, ShapeI, ShapeJ, ShapeL, ShapeO, ShapeS, ShapeT, ShapeU, ShapeX } from "./shape";
import { hasMatrix2DElement, issetCoordinate } from "./helper";
import { Color, Key } from "./config";

const root: HTMLElement = document.getElementById('root');
const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.height = 300;
canvas.width = 300;

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');


//-----------

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

const shape = i;

game.shape = shape;

game.render(true);

// @ts-ignore
window.game = game



