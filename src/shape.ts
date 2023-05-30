import { Color, Coordinate, ShapeRotation } from "./config";

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
    getBlock(offsetX: number) {
        const rows = [];
        const coor: Coordinate[] = [];

        // each row
        for (let y = 0; y < this.tetromino.length; y++) {
            const passes = this.tetromino[y].some(el => !!el);

            if (passes) {
                this.tetromino[y].map((el: number, x: number): number => (el === 1) ? coor.push([ y, x + offsetX ]) : null);
                rows.push(this.tetromino[y])
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

        return { coor, block };
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
    color: Color = Color.LightBlue;
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
    color: Color = Color.Yellow;
    tetromino: Matrix2D = [
        [ 1, 1 ],
        [ 1, 1 ],
    ];
}

/**
 * A row of three Minos with one added above the center. Shaped like a capital T.
 */
export class ShapeT extends Shape {
    color: Color = Color.Purple;
    tetromino: Matrix2D = [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}

/**
 * Two stacked horizontal diminos with the top one offset to the right. Shaped like a capital S.
 */
export class ShapeS extends Shape {
    color: Color = Color.Green;
    tetromino: Matrix2D = [
        [ 0, 1, 1 ],
        [ 1, 1, 0 ],
        [ 0, 0, 0 ],
    ];
}

/**
 * Two stacked horizontal diminos with the top one offset to the left. Shaped like a capital Z.
 */
export class ShapeZ extends Shape {
    color: Color = Color.Red;
    tetromino: Matrix2D = [
        [ 1, 1, 0 ],
        [ 0, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}

/**
 * A row of three Minos with one added above the left side. Shaped like a capital J.
 */
export class ShapeJ extends Shape {
    color: Color = Color.Blue;
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
export class ShapeL extends Shape {
    color: string = '#ea8706';
    tetromino: Matrix2D = [
        [ 0, 0, 0, 1 ],
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}
