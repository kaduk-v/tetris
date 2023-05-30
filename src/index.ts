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

const shape = t;

game.shape = shape;

const render = () => {
    const height = game.playfield.length;
    const width = game.playfield[0].length;

    const coordinates = game.getStartCoordinates(shape);
    const { coor } = shape.getBlock(coordinates[1])

    // column
    for (let y = 0; y < height; y++) {
        const coorY = y * 25;

        // row
        for (let x = 0; x < width; x++) {
            const coorX = x * 25;
            const piece = issetCoordinate(coor, y, x);

            // draw rectangle
            ctx.fillStyle = piece ? Color.Red : Color.White;
            ctx.fillRect(coorX, coorY, 25, 25);

            // draw rectangle border
            ctx.strokeStyle = piece ? Color.White : Color.Blue;
            ctx.lineWidth = 1;
            ctx.strokeRect(coorX, coorY, 25, 25);
        }
    }
}


render();


root.appendChild(canvas)
