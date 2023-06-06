import {
    GridMatrix2D,
    Matrix2D,
    Shape,
    ShapeDot,
    ShapeI,
    ShapeJ,
    ShapeL,
    ShapeO,
    ShapeS,
    ShapeT, ShapeU,
    ShapeX
} from "./shape";
import { Color, Coordinate, Direction, Key, maxLevel, Playfield, Score, ShapeRotation } from "./config";
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
    lines = 0;
    pause = false;

    /**
     * Playfield to render.
     */
    grid: GridMatrix2D = [ ...Array(Playfield.Height) ].map(e => Array(Playfield.Width).fill({
        color: Color.LightGray,
        filled: false
    }));

    /**
     * Active playfield state.
     */
    playfield: Matrix2D = [ ...Array(Playfield.Height) ].map(e => Array(Playfield.Width).fill(0));

    side: Matrix2D = [ ...Array(3) ].map(e => Array(4).fill(0));

    /**
     * Current (active) shape.
     */
    shape: Shape;

    /**
     * Next shape.
     */
    nextShape: Shape;
    timer: IntervalTimer;

    shapes: typeof Shape[];

    constructor() {
        this.timer = new IntervalTimer(this.playRound.bind(this), Playfield.MovementSpeed);
        this.shapes = [
            ShapeT,
            ShapeI,
            ShapeO,
            ShapeO,
            ShapeS,
            ShapeJ,
            ShapeL,
        ]
    }

    public init() {
        this.drawPlayfield();
        this.drawNextShape();

        this.shape = this.getRandomShape();
        this.nextShape = this.getRandomShape();

        this.initControls();
    }

    public play() {
        this.initShape();
        this.start();
    }

    private start() {
        // todo: timeout not work
        // todo: timeout not correct calc

        const levelSpeed = ~~(Playfield.MovementSpeed / maxLevel);
        const timeout = Playfield.MovementSpeed - (levelSpeed * (this.level - 1));

        console.log('levelSpeed: ', levelSpeed);
        console.log('timeout: ', timeout);

        this.timer.start(timeout);
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
            this.start();
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
        }));
    }

    private drawShapeSide() {
        this.drawNextShape()

        const tetromino = this.nextShape.tetromino
        const coordinates: Coordinate[] = [];

        // iterate rows
        for (let y = 0; y < tetromino.length; y++) {
            const hasRowBlock = tetromino[y].some(block => block === 1);

            if (!hasRowBlock) {
                continue;
            }

            // iterate row cells
            for (let x = 0; x < tetromino[y].length; x++) {
                const block = tetromino[y][x];

                if (block === 1) {
                    coordinates.push([ y, x ]);
                }
            }
        }

        coordinates.map(coordinate => Graphic.drawSide(coordinate, {
            color: this.nextShape.color,
        }));
    }

    private clearShape() {
        this.shape.coordinates.map(coordinate => Graphic.clear(coordinate));
    }

    private drawPlayfield() {
        Graphic.clearPlayfield();

        this.grid.forEach((cells, y) => {
            cells.forEach((cell, x) => {
                const { color, filled } = cell;

                Graphic.draw([ y, x ], { color });
            });
        });
    }

    private drawNextShape() {
        Graphic.contextSide.clearRect(0, 0, 4 * Playfield.BlockSide, 3 * Playfield.BlockSide);

        this.side.forEach((cells, y) => {
            cells.forEach((cell, x) => {
                Graphic.drawSide([ y, x ], { color: Color.LightGray });
            });
        });
    }

    /**
     * Draw shape on started position.
     */
    private initShape() {
        const coordinateX = this.getStartXCoordinate();

        this.shape.tetrominoStart = [ 0, coordinateX ];
        this.shape.updateCoordinates(0, coordinateX);

        this.drawShapeSide();

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

        this.updateScore();
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

        // update playfield grid state
        lines.forEach((line) => {
            this.grid[line] = this.grid[line].map(cell => {
                return {
                    color: Color.Gray,
                    filled: true
                }
            });
        });

        this.updateLines(lines.length);
        this.updateLevel();

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
        const shape = random(this.shapes);

        return new shape();
    }

    private removeLines(lines: number[]) {
        for (let i = 0; i < lines.length; i++) {
            const y = lines[i];

            const playfield: Matrix2D = [ ...Array(1) ].map(e => Array(Playfield.Width).fill(0));
            const grid: GridMatrix2D = [ ...Array(1) ].map(e => Array(Playfield.Width).fill({
                color: Color.LightGray,
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


                    if (this.pause) {
                        this.timer.pause();


                        // todo: render pause
                    } else {
                        this.timer.resume();
                        // todo: clear pause
                    }

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

    private updateScore() {
        this.score += Score.Shape;

        Graphic.score.textContent = this.score.toString();
    }

    private updateLines(lines: number) {
        const n = (this.level + 1);

        this.lines += lines;

        switch (lines) {
            case 1:
                this.score += 40 * n;
                break;
            case 2:
                this.score += 100 * n;
                break;
            case 3:
                this.score += 300 * n;
                break;
            case 4:
                this.score += 1200 * n;
                break;

            default:
                throw new Error(`Too many lines at the same time. Count of lines ${lines}`);
        }

        Graphic.lines.textContent = this.lines.toString();
        Graphic.score.textContent = this.score.toString();
    }

    private updateLevel() {
        if (this.level === maxLevel) return;

        // todo: level calc not correct

        if ((this.level * this.lines) / Score.LinesPerLevel > 1) {
            this.level++;
            Graphic.level.textContent = this.level.toString();
        }

        if (this.level === 2) {
            this.shapes.push(ShapeU);
        }

        if (this.level === 3) {
            this.shapes.push(ShapeX);
        }

        if (this.level === 4) {
            this.shapes.push(ShapeDot);
        }
    }
}
