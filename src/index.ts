import './index.html';
import './index.scss';

type State = {
    name: string;
    frames: number;
}

type Position = {
    x: number;
    y: number;
}

type AnimationSprite = {
    [name: string]: {
        loc: Position[]
    };
}

const canvas = document.getElementById('playfield') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const playerSprite = require('../public/shadow-dog.png')

const containerWidth = canvas.width = 600;
const containerHeight = canvas.height = 600;
const staggerFrames = 5;

const playerImg = new Image();
playerImg.src = playerSprite;

const spriteWidth: number = 575;
const spriteHeight: number = 523;

let gameFrame = 0;

const animation: AnimationSprite = {};
const states: State[] = [
    { name: 'idle', frames: 7 },
    { name: 'jump', frames: 7 },
    { name: 'fall', frames: 7 },
    { name: 'run', frames: 9 },
    { name: 'dizzy', frames: 11 },
    { name: 'sit', frames: 5 },
];

states.map((state: State, idx: number) => {
    let position: { loc: Position[] } = { loc: [] };

    for (let i = 0; i < state.frames; i++) {
        const positionX = i * spriteWidth;
        const positionY = idx * spriteHeight;

        position.loc.push({ x: positionX, y: positionY });
    }

    animation[state.name] = position;
});

const state = 'dizzy';

const animate = () => {
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    let position = Math.floor(gameFrame / staggerFrames) % animation[state].loc.length;

    const frameX = spriteWidth * position;
    const frameY = animation[state].loc[position].y;

    ctx.drawImage(
        playerImg,
        frameX,
        frameY,
        spriteWidth,
        spriteHeight,
        0,
        0,
        spriteWidth,
        spriteHeight
    );

    gameFrame++;
    requestAnimationFrame(animate);
}

window.addEventListener('load', () => animate());