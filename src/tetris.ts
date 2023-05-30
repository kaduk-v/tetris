import {Shape} from "./shape";
import { Coordinate, Playfield } from "./config";


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
     *
     */
    playfield: number[][] = [...Array(Playfield.Height)].map(e => Array(Playfield.Width).fill(0));

    /**
     * Current (active) shape.
     */
    shape: Shape;

    /**
     * Next shape.
     */
    nextShape: Shape;

    getStartCoordinates(shape: Shape): Coordinate {
        const x = ~~((this.playfield[0].length - shape.tetromino[0].length) / 2);

        return [0, x];
    }

    /**
     * Coordinate of active shape on playfield.
     */
    coordinate: [];

    moveShapeLeft() {
    }

    moveShapeRight() {
    }

    moveShapeDown() {
    }

    rotateShape() {
        this.shape.rotate();
    }


}
