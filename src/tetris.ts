import {Shape} from "./shape";
import {PlayfieldSize} from "./config";


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
    playfield: number[][] = [...Array(PlayfieldSize.Height)].map(e => Array(PlayfieldSize.Width).fill(0));

    /**
     * Current (active) shape.
     */
    shape: Shape;

    /**
     * Next shape.
     */
    nextShape: Shape;

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
