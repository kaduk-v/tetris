import { GridItem, GridMatrix2D, Matrix2D, Shape, ShapeI, ShapeJ, ShapeL, ShapeO, ShapeS, ShapeT } from "./shape";
import { Color, Coordinate, Key, MovementDirection, Playfield, ShapeRotation } from "./config";
import { hasMatrix2DElement, random } from "./helper";
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

    /**
     * Move shape accordind to direction.
     *
     * @param direction
     * @return {boolean} Moved or not the shape.
     */
    moveShape(direction: MovementDirection) {
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

    init() {
        this.drawPlayfield();

        // todo: draw side panel

        this.shape = this.getRandomShape();
        this.nextShape = this.getRandomShape();

        this.initControls();
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

    startLevel() {
        const coordinateX = this.getStartXCoordinate();

        this.shape.tetrominoStart = [ 0, coordinateX ];
        this.shape.updateCoordinates(0, coordinateX);

        this.drawShape();
    }

    timerId: ReturnType<typeof setTimeout>

    play() {
        this.startLevel();

        this.timerId = setInterval(() => {
            const moved = this.moveShape(MovementDirection.Down);

            if (moved) return;

            this.lockShape();
            this.addNextShape();
            this.checkLines();
            this.startLevel();

        }, 1000);
    }

    private lockShape() {
        this.shape.coordinates.map(coor => {
            const [ y, x ] = coor;

            this.playfield[y][x] = 1;
            this.grid[y][x] = {
                color: this.shape.color,
                filled: true
            };

        });
    }

    private checkLines() {
        const lines: number[] = [];

        // check filled lines
        this.playfield.forEach((cells: number[], line: number) => {
            cells.every(cell => cell === 1) ? lines.push(line) : null;
        });

        // no filled lines yet
        if (!lines.length) return;

        // todo: update score
        this.score += 10;
        this.lines += lines.length;

        this.stopFallingShapes();

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

        this.play()

        // setTimeout(()=> this.play(), 1000)
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
        const playfield: Matrix2D = [ ...Array(lines.length) ].map(e => Array(Playfield.Width).fill(0));
        const grid: GridMatrix2D = [ ...Array(lines.length) ].map(e => Array(Playfield.Width).fill({
            color: Color.White,
            filled: false
        }));

        for (let i = 0; i < lines.length; i++) {
            const y = lines[i];

            this.playfield.splice(y, y);
            this.grid.splice(y, y);
        }

        // todo: here bug. incorrect add new several lines

        // add new lines at the beginning instead of deleted ones
        this.playfield.unshift(...playfield);
        this.grid.unshift(...grid);
    }

    /**
     * Stop the falling shapes.
     */
    private stopFallingShapes() {
        clearInterval(this.timerId);
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
    private isCoordinateAvailable(coordinates: Coordinate[]): boolean {
        let available: boolean[] = [];

        for (const coordinate of coordinates) {
            const [ y, x ] = coordinate;

            available.push(hasMatrix2DElement(this.playfield, y, x) && this.playfield[y][x] === 0);
        }

        return available.filter(available => available).length === coordinates.length;
    }
}
