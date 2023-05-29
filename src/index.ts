import './index.html';
import './index.scss';
import { Tetris } from "./tetris";
import { ShapeI, ShapeO, ShapeT } from "./shape";

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

const render = () => {
    const rows = game.playfield.length;
    const cells = game.playfield[0].length;


    // get coordinates
    // get real size
    // check left/right/bottom

    const start = ~~((cells - o.tetromino[0].length) / 2) - 1;
    t.coordinates = [0, start];

    i.rotate()
    i.rotate()
    console.log('tetromino: ', i.tetromino )
    console.log('size: ', i.getSize() )

    for (let i = 0; i < rows; i++) {
    }



    for (const index in game.playfield) {
        const row = game.playfield[index];
        const y = +index * 25;


        for (const rowEl in row) {
            const piece = row[rowEl];
            const x = +rowEl * 25;

            ctx.fillStyle = piece ? "red" : 'white';
            ctx.fillRect(x, y, 25, 25);

            ctx.strokeStyle = piece ? "white" : 'gray';
            ctx.lineWidth = 0.1;
            ctx.strokeRect(x, y, 25, 25);
        }
    }
}

// console.table(game.playfield )


render();

// setInterval(()=> {
//     render();
//
//     const row = game.playfield.pop();
//     game.playfield.unshift(row)
//
// }, 1000)


root.appendChild(canvas)
