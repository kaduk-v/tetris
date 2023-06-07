import {
    GridMatrix2D,
    Matrix2D,
    Shape,
    ShapeDot,
    ShapeI,
    ShapeJ,
    ShapeL,
    ShapeO,
    ShapeS, ShapeShortL,
    ShapeT,
    ShapeU,
    ShapeX
} from "./shape";
import {
    Color,
    Coordinate,
    Direction,
    Key,
    maxLevel,
    NextShapeType,
    PlayfieldType,
    Score,
    ShapeRotation
} from "./config";
import { hasMatrix2DElement, random } from "./helper";
import { CanvasArea, GraphicFactory } from "./graphic";
import { IntervalTimer } from "./interval-timer";


const scoreElement: Element = document.querySelector('.side-panel .score .value');
const linesElement = document.querySelector('.side-panel .lines .value');
const levelElement = document.querySelector('.side-panel .level .value');

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
    gameOver = false;

    /**
     * Grid to render playfield area.
     */
    playfieldGrid: GridMatrix2D = [ ...Array(PlayfieldType.Height) ].map(e => Array(PlayfieldType.Width).fill({
        color: Color.LightGray,
        filled: false
    }));

    /**
     * Grid to render next shape area.
     */
    nextShapeGrid: GridMatrix2D = [ ...Array(NextShapeType.Height) ].map(e => Array(NextShapeType.Width).fill({
        color: Color.LightGray,
        filled: false
    }));

    /**
     * Active playfield state.
     */
    playfield: Matrix2D = [ ...Array(PlayfieldType.Height) ].map(e => Array(PlayfieldType.Width).fill(0));

    /**
     * Current (active) shape.
     */
    shape: Shape;

    /**
     * Next shape.
     */
    nextShape: Shape;

    /**
     * Available shapes.
     */
    shapes: typeof Shape[] = [
        ShapeT,
        ShapeI,
        ShapeO,
        ShapeO,
        ShapeS,
        ShapeJ,
        ShapeL,
    ];

    playfieldArea: CanvasArea;
    nextShapeArea: CanvasArea;

    timer: IntervalTimer;

    constructor() {
        const factory = new GraphicFactory();

        this.timer = new IntervalTimer(this.playRound.bind(this), PlayfieldType.MovementSpeed);
        this.playfieldArea = factory.createPlayfieldArea();
        this.nextShapeArea = factory.createNextShapeArea();
    }

    public init() {
        this.drawPlayfieldArea();
        this.drawNextShapeArea();

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

        const levelSpeed = ~~(PlayfieldType.MovementSpeed / maxLevel);
        const timeout = PlayfieldType.MovementSpeed - (levelSpeed * (this.level - 1));

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
     * Move shape according to direction.
     *
     * @param [direction]
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
        // cannot rotate shape on pause
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
        this.shape.coordinates.map(coordinate => this.playfieldArea.drawShapeBlock(coordinate, { color: this.shape.color }));
    }

    private drawNextShape() {
        this.drawNextShapeArea();

        const coordinateX = ~~((NextShapeType.Width - this.nextShape.tetromino[0].length) / 2);

        this.nextShape.updateCoordinates(0, coordinateX);
        this.nextShape.coordinates.map(coordinate => this.nextShapeArea.drawShapeBlock(coordinate, { color: this.nextShape.color }));
    }

    private clearShape() {
        this.shape.coordinates.map(coordinate => this.playfieldArea.clearShapeBlock(coordinate));
    }

    private drawPlayfieldArea() {
        this.playfieldArea.clearArea();

        this.playfieldGrid.forEach((cells, y) => {
            cells.forEach((cell, x) => this.playfieldArea.drawShapeBlock([ y, x ], {
                color: cell.color,
                side: PlayfieldType.BlockSide
            }));
        });
    }

    private drawNextShapeArea() {
        this.nextShapeArea.clearArea();

        // always draw this area with empty blocks
        this.nextShapeGrid.forEach((cells, y) => {
            cells.forEach((cell, x) => {
                this.nextShapeArea.drawShapeBlock([ y, x ], { color: Color.LightGray, side: NextShapeType.BlockSide });
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

        this.drawNextShape();

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
            this.playfieldGrid[y][x] = {
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
            this.playfieldGrid[line] = this.playfieldGrid[line].map(cell => {
                return {
                    color: Color.Gray,
                    filled: true
                }
            });
        });

        this.updateLines(lines);

        // re-draw playfield
        this.removeLines(lines);
        this.drawPlayfieldArea();
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
            const w = PlayfieldType.Width;

            const playfield: Matrix2D = [ ...Array(1) ].map(e => Array(w).fill(0));
            const grid: GridMatrix2D = [ ...Array(1) ].map(e => Array(w).fill({
                color: Color.LightGray,
                filled: false
            }));

            this.playfield.splice(y, 1);
            this.playfieldGrid.splice(y, 1);

            // add new lines at the beginning instead of deleted ones
            this.playfield.unshift(...playfield);
            this.playfieldGrid.unshift(...grid);
        }

        if (this.playfield.length !== PlayfieldType.Height) {
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

        scoreElement.textContent = this.score.toString();
    }

    private updateLines(lines: number[]) {
        const n = (this.level + 1);

        // update score by current level
        switch (lines.length) {
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

        // update lines & level
        for (let i = 0; i < lines.length; i++) {
            this.lines++;
            this.updateLevel();
        }

        // update side-bar info
        linesElement.textContent = this.lines.toString();
        scoreElement.textContent = this.score.toString();
        levelElement.textContent = this.level.toString();
    }

    private updateLevel(): void {
        if (this.level === maxLevel) {
            return;
        }

        if (this.lines % Score.LinesPerLevel === 0) {
            this.level++;

            this.addShapeByLevel();
        }
    }

    private addShapeByLevel() {
        switch (this.level) {
            case 2:
                this.shapes.push(ShapeU);

                console.log('U - added.');
                break;

            case 3:
                this.shapes.push(ShapeX);

                console.log('X - added.');
                break;

            case 4:
                this.shapes.push(ShapeDot);

                console.log('Dot - added.')
                break;

            case 5:
                this.shapes.push(ShapeShortL);

                console.log('Short L - added.');
                break;
        }
    }
}
