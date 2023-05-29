import { ShapeRotation } from "./config";
import { map } from "lodash";

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

    getSize() {
        const rows = [];
        const cells = [];

        for (let i = 0; i < this.tetromino.length; i++) {
            const  passes = this.tetromino[i].some(el=>!!el);

            if (passes) {
                rows.push(this.tetromino[i])
            }
        }

        const res = rows.map((row)=> row.findIndex(el=> el===1))

        const max=  Math.max(...res);
        const min=  Math.min(...res);


        const shape = [];
        for (let i = 0; i < rows.length ; i++) {
            const row = [];

            for (let j = min; j <= max; j++) {
                row.push(rows[i][j])
            }

            shape.push(row)
        } 

        return shape


        // // calculate real size of current shape position (without empty pieces of tetromino)
        // return [rows.length, Math.max(...res)]
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
export class ShapeO extends Shape {
    color: string = '#ffff43';
    tetromino: Tetromino = [
        [ 1, 1 ],
        [ 1, 1 ],
    ];
}

/**
 * A row of three Minos with one added above the center. Shaped like a capital T.
 */
export class ShapeT extends Shape {
    color: string = '#7929f1';
    tetromino: Tetromino = [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
    coordinate =  0;
    coordinates =  [0,0];


}

/**
 * Two stacked horizontal diminos with the top one offset to the right. Shaped like a capital S.
 */
class ShapeS extends Shape {
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
class ShapeZ extends Shape {
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
class ShapeJ extends Shape {
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
class ShapeL extends Shape {
    color: string = '#ea8706';
    tetromino: Tetromino = [
        [ 0, 0, 0, 1 ],
        [ 1, 1, 1, 1 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
    ];
}
