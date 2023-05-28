import {ShapeOrientation} from "./config";

/**
 * Two-dimensional matrix.
 */
export type Tetromino = number[][];

export interface Shape {
    /**
     * Shape color.
     */
    color: string;

    tetromino: Tetromino;

    rotate(): void;
}

/**
 * Straight line. Shaped like a capital I.
 */
class I implements Shape {
    color: string = '#41bef8'
    tetromino: Tetromino = [
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ];

    rotate() {
    }
}

/**
 * Square shape. Shaped like a capital O.
 */
class O implements Shape {
    color = '#ffff43';
    tetromino: [
        [1, 1],
        [1, 1],
    ];

    rotate() {
    }
}

/**
 * A row of three Minos with one added above the center. Shaped like a capital T.
 */
class T implements Shape {
    color = '#7929f1';
    tetromino: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ];

    rotate() {
    }
}

/**
 * Two stacked horizontal diminos with the top one offset to the right. Shaped like a capital S.
 */
class S implements Shape {
    color = '#11ea44';
    tetromino: Tetromino = [
        [0, 0, 1, 1],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    rotate() {
    }
}

/**
 * Two stacked horizontal diminos with the top one offset to the left. Shaped like a capital Z.
 */
class Z implements Shape {
    color = '#f30000';
    tetromino: Tetromino = [
        [1, 1, 0, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    rotate() {
    }
}

/**
 * A row of three Minos with one added above the left side. Shaped like a capital J.
 */
class J implements Shape {
    color = '#0662ea';
    tetromino: Tetromino = [
        [1, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    rotate() {
    }
}

/**
 * A row of three Minos with one added above the right side. Shaped like a capital L.
 */
class L implements Shape {
    color = '#ea8706';
    tetromino: Tetromino = [
        [0, 0, 0, 1],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    rotate() {
    }
}
