import { Matrix2D, Shape } from "./shape";
import { Color, Coordinate, Key, MovementDirection, Playfield } from "./config";
import { hasMatrix2DElement, issetCoordinate } from "./helper";


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

    moveRight() {
        const newCoordinates: Coordinate[] = this.shape.move(MovementDirection.Right);

        // todo: get next coord
        // todo: check right wall/shape

        const canMoved = this.isCoordinateAvailable(this.shape.coordinates);

        console.log('canMoved: ', canMoved )

        if (canMoved) {
            this.shape.coordinates = newCoordinates;
            this.render();
        }
    }

    moveLeft() {
        this.shape.coordinates = this.shape.coordinates.map(coordinate => {
            const [ y, x ] = coordinate;

            return [ y, x - 1 ]
        })

        this.render();
    }

    moveDown() {
        this.shape.coordinates = this.shape.coordinates.map(coordinate => {
            const [ y, x ] = coordinate;

            return [ y + 1, x ]
        })

        this.render();
    }

    getStartXCoordinate(): number {
        return ~~((this.playfield[0].length - this.shape.tetromino[0].length) / 2);
    }

    render(f = false) {
        const height = this.playfield.length;
        const width = this.playfield[0].length;

        if (f) {
            const coordinateX = this.getStartXCoordinate();

            this.shape.tetrominoStart = [ 0, coordinateX ];

            this.shape.setCoordinates(0, coordinateX);
        }


        // column
        for (let y = 0; y < height; y++) {
            const coorY = y * 25;

            // row
            for (let x = 0; x < width; x++) {
                const coorX = x * 25;
                const isPiece = issetCoordinate(this.shape.coordinates, y, x);

                // draw rectangle
                this.context.fillStyle = isPiece ? Color.Red : Color.White;
                this.context.fillRect(coorX, coorY, 25, 25);

                // draw rectangle border
                this.context.strokeStyle = isPiece ? Color.White : Color.Blue;
                this.context.lineWidth = 1;
                this.context.strokeRect(coorX, coorY, 25, 25);
            }
        }
    }

    rotateShape() {
        this.shape.rotate();
        this.shape.setCoordinates()
        this.render()
    }

    initEvents() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            switch (e.code) {
                case Key.Left:
                case Key.A:
                    this.moveLeft();
                    break;

                case Key.Right:
                case Key.D:
                    this.moveRight();

                    break;

                case Key.Down:
                case Key.S:
                    this.moveDown();
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

        canvas.height = 300;
        canvas.width = 300;

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
