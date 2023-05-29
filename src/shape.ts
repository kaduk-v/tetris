import { ShapeRotation } from "./config";

/**
 * Two-dimensional matrix.
 */
export type Tetromino = number[][];

export abstract class Shape {
    /**
     * Shape color.
     */
    abstract color: string;

    abstract tetromino: Tetromino;

    /**
     *  Rotate a 2 dimensional matrix 90 degrees.
     */
    rotate(rotation: ShapeRotation = ShapeRotation.Clockwise): void {
        switch (rotation) {
            case ShapeRotation.CounterClockwise:
                this.tetromino = this.tetromino[0].map((val, index) => this.tetromino.map(row => row[row.length - 1 - index]));
                return;

            case ShapeRotation.Clockwise:
                this.tetromino = this.tetromino.map((val, index) => this.tetromino.map(row => row[index]).reverse());
                return;
        }

        throw new Error('Cannot rotate shape. Unsupported shape rotation');
    }
}


/**
 * Straight line. Shaped like a capital I.
 */
export class I extends Shape {
    color: string = '#41bef8';
    tetromino: Tetromino = [
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}

/**
 * Square shape. Shaped like a capital O.
 */
export class O extends Shape {
    color: string = '#ffff43';
    tetromino: Tetromino = [
        [ 1, 1 ],
        [ 1, 1 ],
    ];
}

/**
 * A row of three Minos with one added above the center. Shaped like a capital T.
 */
export class T extends Shape {
    color: string = '#7929f1';
    tetromino: Tetromino = [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}

/**
 * Two stacked horizontal diminos with the top one offset to the right. Shaped like a capital S.
 */
class S extends Shape {
    color: string = '#11ea44';
    tetromino: Tetromino = [
        [ 0, 0, 1, 1 ],
        [ 1, 1, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}

/**
 * Two stacked horizontal diminos with the top one offset to the left. Shaped like a capital Z.
 */
class Z extends Shape {
    color: string = '#f30000';
    tetromino: Tetromino = [
        [ 1, 1, 0, 0 ],
        [ 0, 0, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}

/**
 * A row of three Minos with one added above the left side. Shaped like a capital J.
 */
class J extends Shape {
    color: string = '#0662ea';
    tetromino: Tetromino = [
        [ 1, 0, 0, 0 ],
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}

/**
 * A row of three Minos with one added above the right side. Shaped like a capital L.
 */
class L extends Shape {
    color: string = '#ea8706';
    tetromino: Tetromino = [
        [ 0, 0, 0, 1 ],
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}
