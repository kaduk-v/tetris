import { Matrix2D, Shape } from "./shape";
import { Color, Coordinate, Key, MovementDirection, Playfield, ShapeRotation } from "./config";
import { hasMatrix2DElement } from "./helper";
import { Graphic } from "./graphic";


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


    /**
     * Current (active) shape.
     */
    shape: Shape;

    /**
     * Next shape.
     */
    nextShape: Shape;

    moveShape(direction: MovementDirection) {
        const newCoordinates: Coordinate[] = this.shape.move(direction);
        const canMoved: boolean = this.isCoordinateAvailable(newCoordinates);

        if (canMoved) {
            this.clearShape();
            this.shape.offsetTetromino(direction);
            this.shape.coordinates = newCoordinates;
            this.drawShape();
        }
    }

    rotateShape() {
        this.clearShape()
        this.shape.rotate();

        const canRotate: boolean = this.isCoordinateAvailable(this.shape.coordinates);

        if (!canRotate) {
            // rollback
            this.shape.rotate(ShapeRotation.CounterClockwise);
        }

        this.drawShape();
    }

    drawShape() {
        this.shape.coordinates.map(coordinate => Graphic.draw(coordinate, {
            color: this.shape.color,
            borderColor: Color.White
        }));
    }

    clearShape() {
        this.shape.coordinates.map(coordinate => Graphic.clear(coordinate, {
            borderColor: Color.Gray
        }));
    }

    highlightLine() {
        const width = Playfield.Width * 25


        setInterval(() => {
            for (let i = 0; i < Playfield.Height; i++) {
                Graphic.draw([ 4, i ], { width, color: Color.Purple, borderColor: Color.White })
            }
        }, 800)

        setInterval(() => {
            for (let i = 0; i < Playfield.Height; i++) {
                Graphic.draw([ 4, i ], { width, color: Color.White, borderColor: Color.Gray })
            }
        }, 900)

    }

    render() {
        // draw playfield
        for (let y = 0; y < Playfield.Height; y++) {
            for (let x = 0; x < Playfield.Width; x++) {
                Graphic.draw([ y, x ], { color: Color.White, borderColor: Color.Gray });
            }
        }

        // todo: draw side panel
    }

    start() {
        const coordinateX = this.getStartXCoordinate();

        this.shape.tetrominoStart = [ 0, coordinateX ];
        this.shape.updateCoordinates(0, coordinateX);

        this.drawShape();
        this.initControls();
    }

    /**
     * Calculate centre of Y axis (first row).
     */
    getStartXCoordinate(): number {
        return ~~((this.playfield[0].length - this.shape.tetromino[0].length) / 2);
    }

    initControls() {
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
