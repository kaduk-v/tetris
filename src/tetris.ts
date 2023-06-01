import { Matrix2D, Shape } from "@src/shape";
import { Color, Coordinate, Key, MovementDirection, Playfield } from "@src/config";
import { hasMatrix2DElement, issetCoordinate } from "@src/helper";


// todo: game state
// todo: game controls

export class Tetris {
    /**
     * Game score.
     */
    score = 0;

    /**
     * Game level.
     */
    level = 1;
    topScore = 0;
    lines = 0;

    /**
     * Playfield to render.
     */
    activePlayfield: Matrix2D = [ ...Array(Playfield.Height) ].map(e => Array(Playfield.Width).fill(0));

    playfield: Matrix2D = [ ...Array(Playfield.Height) ].map(e => Array(Playfield.Width).fill(0));

    context: CanvasRenderingContext2D

    /**
     * Current (active) shape.
     */
    shape: Shape;

    /**
     * Next shape.
     */
    nextShape: Shape;

    constructor() {
        this.initEvents();
        this.initCanvas();
    }

    moveShape(direction: MovementDirection) {
        const newCoordinates: Coordinate[] = this.shape.move(direction);
        const canMoved: boolean = this.isCoordinateAvailable(newCoordinates);

        if (canMoved) {
            this.shape.coordinates = newCoordinates;
            this.render();
        }
    }

    rotateShape() {
        this.shape.rotate();
        this.shape.setCoordinates()
        this.render()
    }

    render(isStart = false) {

        if (isStart) {
            const coordinateX = this.getStartXCoordinate();

            this.shape.tetrominoStart = [ 0, coordinateX ];
            this.shape.setCoordinates(0, coordinateX);
        }

        // rows
        for (let y = 0; y < Playfield.Height; y++) {
            const coorY = y * Playfield.BlockSide;

            // row cells
            for (let x = 0; x < Playfield.Width; x++) {
                const coorX = x * Playfield.BlockSide;
                const isPiece = issetCoordinate(this.shape.coordinates, y, x);

                // draw rectangle
                this.context.fillStyle = isPiece ? this.shape.color : Color.White;
                this.context.fillRect(coorX, coorY, Playfield.BlockSide, Playfield.BlockSide);

                // draw rectangle border
                this.context.strokeStyle = isPiece ? Color.White : Color.Blue;
                this.context.lineWidth = isPiece ? 1 : Playfield.LineWidth;
                this.context.strokeRect(coorX, coorY, Playfield.BlockSide, Playfield.BlockSide);
            }
        }
    }

    /**
     * Calculate centre of Y axis (first row).
     */
    getStartXCoordinate(): number {
        return ~~((this.playfield[0].length - this.shape.tetromino[0].length) / 2);
    }

    initEvents() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            switch (e.code) {
                case Key.Left:
                case Key.A:
                    this.moveShape(MovementDirection.Left);
                    break;

                case Key.Right:
                case Key.D:
                    this.moveShape(MovementDirection.Right);
                    break;

                case Key.Down:
                case Key.S:
                    this.moveShape(MovementDirection.Down);
                    break;

                case Key.Up:
                case Key.W:
                    this.rotateShape();
                    break;

                case Key.Space:
                    console.log('TODO: Pause/Play');
                    break;
            }
        });
    }

    initCanvas() {
        const root: HTMLElement = document.getElementById('root');
        const canvas: HTMLCanvasElement = document.createElement('canvas');

        canvas.height = Playfield.Height * Playfield.BlockSide;
        canvas.width = Playfield.Width * Playfield.BlockSide;

        this.context = canvas.getContext('2d');

        root.appendChild(canvas);
    }

    /**
     * @param [coordinates] Shape coordinates;
     */
    isCoordinateAvailable(coordinates: Coordinate[]): boolean {
        let available: boolean[] = [];

        for (const coordinate of coordinates) {
            const [ y, x ] = coordinate;

            available.push(hasMatrix2DElement(this.playfield, y, x) && this.playfield[y][x] === 0);
        }

        return available.filter(available => available).length === coordinates.length;
    }
}
