import './index.html';
import './index.scss';

const width = 10;
const height = 20;

class Tetris {
    score = 0;
    level = 0;
}


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

for (const row in field) {
    console.log('row: ', row);
    console.log('LOG: ', field[row]);
}


ctx.fillStyle = "red";
ctx.fillRect(50, 50, 25, 25);

ctx.fillStyle = "blue";
ctx.fillRect(50, 25, 25, 25);

// Намалюємо прямокутник
ctx.fillStyle = "red";
ctx.fillRect(50, 50, 100, 100);

// Намалюємо рамку навколо прямокутника
ctx.strokeStyle = "green";
ctx.lineWidth = 2
ctx.strokeRect(50, 50, 100, 100);




root.appendChild(canvas)
