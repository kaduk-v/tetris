import './index.html';
import './index.scss';
import {Tetris} from "./tetris";
import { Tetromino, T } from "./shape";

const game = new Tetris();
const t = new T();

console.log('rotate 0: ', t.tetromino )
t.rotate()
console.log('rotate 90: ', t.tetromino )
t.rotate()
console.log('rotate 180: ', t.tetromino )
t.rotate()
console.log('rotate 270: ', t.tetromino )

t.rotate(2)
console.log('rotate 180: ', t.tetromino )


const root: HTMLElement = document.getElementById('root');
const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.height = 300;
canvas.width = 300;

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');


const field = [
    [0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
];

const T2: Tetromino = [
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];




const render = () => {
    for (const index in field) {
        const row = field[index];
        const y = +index * 25;

        for (const rowEl in row) {
            const piece = row[rowEl];
            const x = +rowEl * 25;

            ctx.fillStyle = piece ? "red" : 'white';
            ctx.fillRect(x, y, 25, 25);

            ctx.strokeStyle = piece ? "white" : 'gray';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, 25, 25);
        }
    }
}

// setInterval(()=> {
//     render();
//
//     const row = field.pop();
//     field.unshift(row)
//
// }, 1000)


root.appendChild(canvas)
