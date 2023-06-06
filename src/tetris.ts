import { GridMatrix2D, Matrix2D, Shape, ShapeI, ShapeJ, ShapeL, ShapeO, ShapeS, ShapeT } from "./shape";
import { Color, Coordinate, Key, Direction, Playfield, ShapeRotation } from "./config";
import { hasMatrix2DElement, random } from "./helper";
import { Graphic } from "./graphic";
import { IntervalTimer } from "./interval-timer";


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

    pause = false;

    /**
     * Playfield to render.
     */
    grid: GridMatrix2D = [ ...Array(Playfield.Height) ].map(e => Array(Playfield.Width).fill({
        color: Color.White,
        filled: false
    }));

    /**
     * Active playfield state.
     */
    playfield: Matrix2D = [ ...Array(Playfield.Height) ].map(e => Array(Playfield.Width).fill(0));

    /**
     * Current (active) shape.
     */
    shape: Shape;

    /**
     * Next shape.
     */
    nextShape: Shape;

    timer: IntervalTimer;

    constructor() {
        this.timer = new IntervalTimer(this.playRound.bind(this), Playfield.MovementSpeed);
    }

    public init() {
        this.drawPlayfield();

        // todo: draw side panel

        this.shape = this.getRandomShape();
        this.nextShape = this.getRandomShape();

        this.initControls();
    }

    public play() {
        this.initShape();
        this.timer.start();
    }

    private restart() {
        // todo: implement
    }

    private playRound() {
        this.timer.pause();

        const shapeMoved = this.moveShape(Direction.Down);

        // continue the movement of the shape
        if (shapeMoved) {
            this.timer.resume();
        }

        // can't move - shape has reached max bottom position
        else {
            this.lockShape();
            this.addNextShape();
            this.processLines();
            this.initShape();

            // start round with new shape
            this.timer.start();
        }
    }

    /**
     * Move shape accordind to direction.
     *
     * @param direction
     * @return {boolean} Moved or not the shape.
     */
    private moveShape(direction: Direction) {
        // cannot move shapes on pause
        if (this.pause) {
            return;
        }

        const newCoordinates: Coordinate[] = this.shape.move(direction);
        const canMove: boolean = this.isCoordinateAvailable(newCoordinates);

        if (canMove) {
            this.clearShape();

            this.shape.offsetTetromino(direction);
            this.shape.coordinates = newCoordinates;

            this.drawShape();
        }

        return canMove;
    }

    private rotateShape() {
        // cannot rotate shapes on pause
        if (this.pause) {
            return;
        }

        this.clearShape()
        this.shape.rotate();

        const canRotate: boolean = this.isCoordinateAvailable(this.shape.coordinates);

        if (!canRotate) {
            // rollback
            this.shape.rotate(ShapeRotation.CounterClockwise);
        }

        this.drawShape();
    }

    private drawShape() {
        this.shape.coordinates.map(coordinate => Graphic.draw(coordinate, {
            color: this.shape.color,
            borderColor: Color.White
        }));
    }

    private clearShape() {
        this.shape.coordinates.map(coordinate => Graphic.clear(coordinate, {
            borderColor: Color.Gray
        }));
    }

    private drawPlayfield() {
        Graphic.clearPlayfield();

        this.grid.forEach((cells, y) => {
            cells.forEach((cell, x) => {
                const { color, filled } = cell;

                Graphic.draw([ y, x ], { color, borderColor: filled ? Color.White : Color.Gray })
            })
        })
    }

    /**
     * Draw shape on started position.
     */
    private initShape() {
        const coordinateX = this.getStartXCoordinate();

        this.shape.tetrominoStart = [ 0, coordinateX ];
        this.shape.updateCoordinates(0, coordinateX);

        const canInit: boolean = this.isCoordinateAvailable(this.shape.coordinates);

        if (canInit) {
            this.drawShape();
        } else {
            this.pause = true;
            this.timer.pause()
        }
    }

    /**
     * To fix shape coordinates on playfield.
     */
    private lockShape() {
        this.shape.coordinates.map(coordinate => {
            const [ y, x ] = coordinate;

            this.playfield[y][x] = 1;
            this.grid[y][x] = {
                color: this.shape.color,
                filled: true
            };
        });
    }

    private processLines() {
        const lines: number[] = [];

        // check filled lines
        this.playfield.forEach((cells: number[], line: number) => {
            cells.every(cell => cell === 1) ? lines.push(line) : null;
        });

        // no filled lines yet
        if (!lines.length) {
            return;
        }

        // todo: update score
        this.score += 10;
        this.lines += lines.length;

        // update playfield grid state
        lines.forEach((line) => {
            this.grid[line] = this.grid[line].map(cell => {
                return {
                    color: Color.Gray,
                    filled: true
                }
            })
        });

        // todo: use promise to blink lines

        // re-draw playfield
        this.drawPlayfield();
        this.removeLines(lines);
        this.drawPlayfield();
    }

    private addNextShape() {
        this.shape = this.nextShape;
        this.nextShape = this.getRandomShape();
    }

    private getRandomShape(): Shape {
        const shape = random([
            ShapeT,
            ShapeI,
            ShapeO,
            ShapeO,
            ShapeS,
            ShapeJ,
            ShapeL,
        ]);

        return new shape();
    }

    private removeLines(lines: number[]) {
        for (let i = 0; i < lines.length; i++) {
            const y = lines[i];

            const playfield: Matrix2D = [ ...Array(1) ].map(e => Array(Playfield.Width).fill(0));
            const grid: GridMatrix2D = [ ...Array(1) ].map(e => Array(Playfield.Width).fill({
                color: Color.White,
                filled: false
            }));

            this.playfield.splice(y, 1);
            this.grid.splice(y, 1);

            // add new lines at the beginning instead of deleted ones
            this.playfield.unshift(...playfield);
            this.grid.unshift(...grid);
        }

        if (this.playfield.length !== Playfield.Height) {
            throw new Error('Incorrect remove lines');
        }
    }

    /**
     * Calculate centre of Y axis (first row).
     */
    private getStartXCoordinate(): number {
        return ~~((this.playfield[0].length - this.shape.tetromino[0].length) / 2);
    }

    private initControls() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {

            switch (e.code) {
                case Key.Left:
                case Key.A:
                    this.moveShape(Direction.Left);
                    break;

                case Key.Right:
                case Key.D:
                    this.moveShape(Direction.Right);
                    break;

                case Key.Down:
                case Key.S:
                    this.moveShape(Direction.Down);
                    break;

                case Key.Up:
                case Key.W:
                    this.rotateShape();
                    break;

                case Key.Space:
                    this.pause = !this.pause;

                    this.pause ? this.timer.pause() : this.timer.resume();
                    break;
            }
        });
    }

    /**
     * @param [coordinates] Shape coordinates;
     */
    private isCoordinateAvailable(coordinates: Coordinate[]): boolean {
        let available: boolean[] = [];

        for (const coordinate of coordinates) {
            const [ y, x ] = coordinate;

            available.push(hasMatrix2DElement(this.playfield, y, x) && this.playfield[y][x] === 0);
        }

        return available.filter(available => available).length === coordinates.length;
    }
}
