import {
    Coordinate,
    GridMatrix2D,
    Matrix2D,
    Color,
    Direction,
    Key,
    NextShapeType,
    ShapeRotation,
    PlayfieldType,
    Score,
    highlightedLineBlock,
    maxLevel,
    emptyGridBlock, levelSpeed,
} from "./config";

import {
    Shape,
    ShapeDot,
    ShapeI,
    ShapeJ,
    ShapeL,
    ShapeO, ShapeP,
    ShapeS, ShapeShortL,
    ShapeT,
    ShapeU,
    ShapeX
} from "./shape";

import { emptyGrig, emptyMatrix2D, hasMatrix2DElement, random } from "./helper";
import { CanvasArea, GraphicFactory } from "./graphic";


const scoreElement: Element = document.querySelector('.side-panel .score .value');
const topScoreElement: Element = document.querySelector('.side-panel .top-score .value');
const linesElement = document.querySelector('.side-panel .lines .value');
const levelElement = document.querySelector('.side-panel .level .value');
const pauseElement: HTMLElement = document.querySelector('.side-panel .game-pause');

const baseShapeList: typeof Shape[] = [
    ShapeT,
    ShapeI,
    ShapeO,
    ShapeS,
    ShapeJ,
    ShapeL,
];

export class Tetris {
    /**
     * Game score.
     */
    private score = 0;

    /**
     * Game level.
     */
    private level = 0;

    private lines = 0;
    private onPause = false;
    private gameOver = false;

    /**
     * Last round tick time.
     */
    private prevTime: number = 0;

    /**
     * Grid to render playfield area.
     */
    private playfieldGrid: GridMatrix2D = emptyGrig(PlayfieldType.Height, PlayfieldType.Width);

    /**
     * Grid to render next shape area.
     */
    private nextShapeGrid: GridMatrix2D = emptyGrig(NextShapeType.Height, NextShapeType.Width);

    /**
     * Active playfield state.
     */
    private playfield: Matrix2D = emptyMatrix2D(PlayfieldType.Height, PlayfieldType.Width);

    /**
     * Current (active) shape.
     */
    private shape: Shape;

    /**
     * Next shape.
     */
    private nextShape: Shape;

    /**
     * Available shapes.
     */
    private shapes: typeof Shape[] = [...baseShapeList];

    private playfieldArea: CanvasArea;
    private nextShapeArea: CanvasArea;

    private animationId: ReturnType<typeof requestAnimationFrame>;

    constructor() {
        const factory = new GraphicFactory();

        this.playfieldArea = factory.createPlayfieldArea();
        this.nextShapeArea = factory.createNextShapeArea();

        this.initControls();
    }

    public init() {
        this.drawPlayfieldArea();
        this.drawNextShapeArea();
        this.printTopScore();

        this.shape = this.getRandomShape();
        this.nextShape = this.getRandomShape();
    }

    public play() {
        this.initRound();
        this.start();
    }

    private start() {
        pauseElement.style.setProperty('visibility', 'hidden');
        this.animationId = requestAnimationFrame(this.runRoundTick.bind(this));
    }

    private pause() {
        pauseElement.style.setProperty('visibility', 'visible');
        cancelAnimationFrame(this.animationId);
    }

    private restart() {
        this.resetScore();
        this.init();
        this.play();
    }

    private gameFinish() {
        cancelAnimationFrame(this.animationId);

        this.gameOver = true;
        this.playfieldArea.drawGaveOver();

        const topScore = +localStorage.getItem("top-score");
        if (this.score > topScore) {
            localStorage.setItem("top-score", this.score.toString());
        }
    }

    private runRoundTick() {
        this.animationId = requestAnimationFrame(this.runRoundTick.bind(this));

        const now = Date.now();
        const diff = (now - this.prevTime);

        if (diff > this.gameSpeed()) {
            const shapeMoved = this.moveShape(Direction.Down);

            // can't move - shape has reached max bottom position
            if (!shapeMoved) {
                this.lockShapeOnGrid();
                this.addNextShape();
                this.processLines();
                this.initRound();
            }

            this.prevTime = now;
        }
    }

    /**
     * Move shape according to direction.
     *
     * @param [direction]
     * @return {boolean} Moved or not the shape.
     */
    private moveShape(direction: Direction) {
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
        this.clearShape()
        this.shape.rotate();

        const canRotate: boolean = this.isCoordinateAvailable(this.shape.coordinates);

        // rollback
        if (!canRotate) {
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
    private initRound() {
        const coordinateX = this.getStartXCoordinate();

        this.shape.tetrominoStart = [ 0, coordinateX ];
        this.shape.updateCoordinates(0, coordinateX);

        this.drawNextShape();

        const canInit: boolean = this.isCoordinateAvailable(this.shape.coordinates);

        canInit ? this.drawShape() : this.gameFinish();
    }

    /**
     * To fix shape coordinates on playfield.
     */
    private lockShapeOnGrid() {
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

        // collect filled lines
        this.playfield.forEach((cells: number[], line: number) => {
            cells.every(cell => cell === 1) ? lines.push(line) : null;
        });

        // no filled lines yet
        if (!lines.length) {
            return;
        }

        // highlight filled line
        lines.forEach((line) => this.playfieldGrid[line] = this.playfieldGrid[line].map(cell => highlightedLineBlock));

        this.updateGameProgress(lines);

        // render playfield
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
            const grid: GridMatrix2D = [ ...Array(1) ].map(e => Array(w).fill(emptyGridBlock));

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

            // restart game
            if (this.gameOver) return this.restart();

            // cannot move shape on pause
            if (this.onPause && e.code !== Key.Space) return;

            // control game
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
                    this.onPause = !this.onPause;
                    this.onPause ? this.pause() : this.start();

                    break;
            }
        });
    }

    /**
     * @param [coordinates] Shape coordinates.
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

    /**
     * Update value of score, lines, level.
     * Also add new shapes to game.
     *
     * @param [lines]
     */
    private updateGameProgress(lines: number[]) {
        // score depends on current level
        const n = (this.level + 1);

        // update score by count of filled lines
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
                throw new Error(`Too many lines at the same time. Count of lines - ${lines}`);
        }

        // update count lines & current level
        for (let i = 0; i < lines.length; i++) {
            this.lines++;
            this.increaseLevel();
        }

        // update side-bar info
        this.printScore();
    }

    private printScore() {
        linesElement.textContent = this.lines.toString();
        scoreElement.textContent = this.score.toString();
        levelElement.textContent = this.level.toString();

        this.printTopScore();
    }

    private resetScore() {
        this.score = 0;
        this.level = 0;
        this.lines = 0;
        this.prevTime = 0;
        this.onPause = false;
        this.gameOver = false;

        this.playfieldGrid = emptyGrig(PlayfieldType.Height, PlayfieldType.Width);
        this.nextShapeGrid = emptyGrig(NextShapeType.Height, NextShapeType.Width);
        this.playfield = emptyMatrix2D(PlayfieldType.Height, PlayfieldType.Width);

        this.shapes = [...baseShapeList];

        this.printScore();
    }

    private increaseLevel(): void {
        if (this.level === maxLevel) {
            return;
        }

        if (this.lines % Score.LinesPerLevel === 0) {
            this.level++;

            this.enrichShapesList();
        }
    }

    /**
     * With each new level, we add a new shape to the game.
     */
    private enrichShapesList() {
        switch (this.level) {
            case 2:
                this.shapes.push(ShapeP);

                console.log('P - added.');
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

    private gameSpeed(): number {
        return PlayfieldType.MovementSpeed - (levelSpeed * (this.level - 1));
    }

    private printTopScore() {
        topScoreElement.textContent = localStorage.getItem("top-score") || '0';
    }
}
