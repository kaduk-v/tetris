import { ShapeOrientation } from "./config";

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
     *  Rotate a 2 dimensional matrix 90 degrees clockwise.
     */
    rotate() {
        // get the dimensions of the source matrix
        const M = this.tetromino.length;
        const N = this.tetromino[0].length;


        // create a new NxM destination array
        let destination = new Array(N);
        for (let i = 0; i < N; i++) {
            destination[i] = new Array(M);
        }


        // start copying from source into destination
        for (let x = 0; x < N; x++) {
            for (let y = 0; y < M; y++) {
                destination[x][y] = this.tetromino[M - y - 1][x];
            }
        }

        // return the destination matrix
        this.tetromino = destination;
    }
}


/**
 * Straight line. Shaped like a capital I.
 */
class I extends Shape {
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
class O extends Shape {
    color = '#ffff43';
    tetromino: [
        [ 1, 1 ],
        [ 1, 1 ],
    ];
}

/**
 * A row of three Minos with one added above the center. Shaped like a capital T.
 */
class T extends Shape {
    color = '#7929f1';
    tetromino: [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}

/**
 * Two stacked horizontal diminos with the top one offset to the right. Shaped like a capital S.
 */
class S extends Shape {
    color = '#11ea44';
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
    color = '#f30000';
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
    color = '#0662ea';
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
    color = '#ea8706';
    tetromino: Tetromino = [
        [ 0, 0, 0, 1 ],
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}
