import './index.html';
import './index.scss';
import {Tetris} from "./tetris";
import { Tetromino } from "./shape";

const game = new Tetris();

const root: HTMLElement = document.getElementById('root');
const canvas: HTMLCanvasElement = document.createElement('canvas');

canvas.height = 300;
canvas.width = 300;

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const shuffle = (unshuffled: string[]): string[] => {
    return unshuffled
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value)
}

const field = [
    [0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
];

const T: Tetromino = [
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

const rotateMatrix90C = (source: Tetromino) => {
    // get the dimensions of the source matrix
    const M = source.length; // y
    const N = source[0].length; // x

    console.log( {M, N} )

    // create a new NxM destination array
    let destination = new Array(N);
    for (let i = 0; i < N; i++) {
        destination[i] = new Array(M);
    }

    console.log( {destination} )

    // start copying from source into destination
    for (let x = 0; x < N; x++) {
        for (let y = 0; y < M; y++) {
            destination[x][y] = source[M - y - 1][x];
        }
    }

    // return the destination matrix
    return destination;
};

const t1 = rotateMatrix90C(T);
const t2 = rotateMatrix90C(t1);
const t3 = rotateMatrix90C(t2);
const t4 = rotateMatrix90C(t3);

console.log('LOG: ', { T, t1,t2,t3,t4 }  )


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
