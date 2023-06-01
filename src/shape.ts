import { Color, Coordinate, MovementDirection, ShapeRotation } from "@src/config";

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

    tetrominoStart: Coordinate = [0,0]

    /**
     * Shape blocks coordinates on playfield.
     */
    coordinates: Coordinate[];

    /**
     * Fetch new shape coordinates according to movement direction.
     *
     * @param [direction] - Shape movement direction.
     */
    move(direction: MovementDirection): Coordinate[] {
        if (!this.coordinates.length) {
            throw new Error('Shape doesnt have coordinates');
        }

        return this.coordinates.map(coordinate => {
            const [ y, x ] = coordinate;

            switch (direction) {
                case MovementDirection.Left:
                    return [ y, x - 1 ];

                case MovementDirection.Right:
                    return [ y, x + 1 ];

                case MovementDirection.Down:
                    return [ y + 1, x ];
            }
        });
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

    // draw(playfield) {
    //
    // }

    /**
     * Update shape coordinates on playfield.
     *
     * @param [offsetY]
     * @param [offsetX]
     */
    setCoordinates(offsetY: number = 0, offsetX: number = 0) {
        const tetromino: Coordinate[] = [];
        const coordinates: Coordinate[] = [];

        // iterate rows
        for (let y = 0; y < this.tetromino.length; y++) {
            const hasRowPiece = this.tetromino[y].some(piece => piece === 1);

            if (!hasRowPiece) {
                continue;
            }

            // iterate row cells
            for (let x = 0; x < this.tetromino[y].length; x++) {
                const piece = this.tetromino[y][x];

                if (piece === 1) {
                    coordinates.push([ y + offsetY, x + offsetX ]);
                }
            }
        }

        this.coordinates = coordinates;
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
        [ 1, 0, 0 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}

/**
 * A row of three Minos with one added above the right side. Shaped like a capital L.
 */
export class ShapeL extends Shape {
    color: string = Color.Orange;
    tetromino: Matrix2D = [
        [ 0, 0, 1 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}


// TODO: additional shapes
export class ShapeDot extends Shape {
    color: string = '#ea8706';
    tetromino: Matrix2D = [
        [ 1 ],
    ];
}

export class ShapeX extends Shape {
    color: string = '#ea8706';
    tetromino: Matrix2D = [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 1, 0 ],
    ];
}

export class ShapeU extends Shape {
    color: string = '#ea8706';
    tetromino: Matrix2D = [
        [ 1, 0, 1 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}
