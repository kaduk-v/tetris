import { ShapeRotation } from "./config";

/**
 * Two-dimensional matrix.
 */
export type Matrix2D = number[][];

export abstract class Shape {
    /**
     * Shape color.
     */
    abstract color: string;

    /**
     * Geometric shape composed of four squares, connected orthogonally.
     */
    abstract tetromino: Matrix2D;

    /**
     * Real size of shape position (without empty pieces of tetromino).
     */
    getBlock(): Matrix2D {
        const rows = [];

        for (let i = 0; i < this.tetromino.length; i++) {
            const passes = this.tetromino[i].some(el => !!el);

            if (passes) {
                rows.push(this.tetromino[i])
            }
        }

        const mins = rows.map((row) => row.findIndex(el => !!el))
        const maxs = rows.map((row) => row.findLastIndex(el => !!el))


        const max = Math.max(...maxs);
        const min = Math.min(...mins);


        const block = [];
        for (let i = 0; i < rows.length; i++) {
            const row = [];

            for (let j = min; j <= max; j++) {
                row.push(rows[i][j])
            }

            block.push(row)
        }

        return block;
    }

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
export class ShapeI extends Shape {
    color: string = '#41bef8';
    tetromino: Matrix2D = [
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}

/**
 * Square shape. Shaped like a capital O.
 */
export class ShapeO extends Shape {
    color: string = '#ffff43';
    tetromino: Matrix2D = [
        [ 1, 1 ],
        [ 1, 1 ],
    ];
}

/**
 * A row of three Minos with one added above the center. Shaped like a capital T.
 */
export class ShapeT extends Shape {
    color: string = '#7929f1';
    tetromino: Matrix2D = [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}

/**
 * Two stacked horizontal diminos with the top one offset to the right. Shaped like a capital S.
 */
class ShapeS extends Shape {
    color: string = '#11ea44';
    tetromino: Matrix2D = [
        [ 0, 0, 1, 1 ],
        [ 1, 1, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}

/**
 * Two stacked horizontal diminos with the top one offset to the left. Shaped like a capital Z.
 */
class ShapeZ extends Shape {
    color: string = '#f30000';
    tetromino: Matrix2D = [
        [ 1, 1, 0, 0 ],
        [ 0, 0, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}

/**
 * A row of three Minos with one added above the left side. Shaped like a capital J.
 */
class ShapeJ extends Shape {
    color: string = '#0662ea';
    tetromino: Matrix2D = [
        [ 1, 0, 0, 0 ],
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}

/**
 * A row of three Minos with one added above the right side. Shaped like a capital L.
 */
class ShapeL extends Shape {
    color: string = '#ea8706';
    tetromino: Matrix2D = [
        [ 0, 0, 0, 1 ],
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}
