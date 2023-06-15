import './index.html';
import './index.scss';

const canvas: HTMLCanvasElement = document.querySelector('#playfield');
const ctx = canvas.getContext('2d');

const width = 800;
const height = 500;

canvas.width = width;
canvas.height = height;

const img = document.getElementById('unit') as HTMLImageElement;

/**
 * Keyboard code.
 */
export enum Key {
    Space = 'Space',
    Left = 'ArrowLeft',
    Right = 'ArrowRight',
    Up = 'ArrowUp',
    Down = 'ArrowDown',
    A = 'KeyA',
    S = 'KeyS',
    D = 'KeyD',
    W = 'KeyW'
}

class Keyboard {
    private keys = new Set<string>();

    constructor() {
        window.addEventListener('keydown', e => this.keys.add(e.code));
        window.addEventListener('keyup', e => this.keys.delete(e.code));
    }

    public has(key: Key): boolean {
        return this.keys.has(key);
    }
}

class Player {
    private height = 60;
    private width = 50;
    private x = 0;
    private y = height - this.height;
    private speed = 0;
    private vy = 0;
    private weight = 1;


    public draw() {
        const { x, y, width, height } = this;

        // ctx.fillStyle = 'orange';
        // ctx.fillRect(x, y, width, height)

        ctx.drawImage(img, x, y, this.width, this.height);
    }

    public update(input: Keyboard) {
        const speedStep = 2;

        // movement
        if (input.has(Key.Right)) {
            this.speed = speedStep;
        } else if (input.has(Key.Left)) {
            this.speed = -speedStep;
        } else {
            this.speed = 0;
        }

        if (input.has(Key.Up) && this.onGround()) {
            this.vy = -25;
        }

        // horizontal
        this.x += this.speed;
        const side = width - this.width;

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > side) {
            this.x = side;
        }

        // vertical
        this.y += this.vy;
        const bottom = height - this.height;

        if (this.y > bottom) {
            this.y = bottom;
        }

        this.vy = this.onGround() ? 0 : this.vy + this.weight;
    }

    public onGround(): boolean {
        return this.y >= height - this.height;
    }
}

const input = new Keyboard();
const player = new Player();

const animate = () => {
    ctx.clearRect(0, 0, width, height);

    player.draw();
    player.update(input);

    requestAnimationFrame(animate);
}

window.addEventListener('load', () => {
    animate();
})
