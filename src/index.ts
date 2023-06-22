import './index.html';
import './index.scss';

const canvas = document.getElementById('playfield') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const enemy1 = require('../public/enemies/enemy1.png');

const containerWidth = canvas.width = 600;
const containerHeight = canvas.height = 600;
const enemiesCount = 10;
const enemies: Enemy[] = [];

const enemyImg = new Image();
enemyImg.src = enemy1;

let gameFrames = 0;

class Enemy {
    private speed = 2;
    private spriteWidth = 293;
    private spriteHeight = 155;
    private width = this.spriteWidth / 2.5;
    private height = this.spriteHeight / 2.5;
    private x = Math.random() * (containerWidth - this.width);
    private y = Math.random() * (containerHeight - this.height);
    private frame = 0;
    private flapSpeed = Math.floor((Math.random() * 3) + 1);

    update() {
        this.x += Math.random() * 15 - 7.5;
        this.y += Math.random() * 10 - 5;

        // animate sprites
        if (gameFrames % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }

        return this;
    }

    draw() {
        ctx.drawImage(
            enemyImg,
            // cut img from sprite
            this.frame * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            // draw img on canvas
            this.x,
            this.y,
            this.width,
            this.height
        );

        return this;
    }
}


for (let i = 0; i < enemiesCount; i++) {
    enemies.push(new Enemy());
}


const animate = () => {
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    enemies.map(enemy => enemy.update().draw());

    gameFrames++;
    requestAnimationFrame(animate);
}

window.addEventListener('load', () => animate());