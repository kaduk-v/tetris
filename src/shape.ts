import { Color, Coordinate, Direction, Matrix2D, PlayfieldType, ShapeRotation } from "./config";

export abstract class Shape {
    /**
     * Shape color.
     */
    abstract color: Color;

    /**
     * Geometric shape composed of four squares, connected orthogonally.
     */
    abstract tetromino: Matrix2D;

    tetrominoStart: Coordinate = [ 0, 0 ];

    /**
     * Shape blocks coordinates on playfield.
     */
    coordinates: Coordinate[];

    /**
     * Fetch new shape coordinates according to movement direction.
     *
     * @param [direction] - Shape movement direction.
     */
    move(direction: Direction): Coordinate[] {
        if (!this.coordinates.length) {
            throw new Error('Shape doesnt have coordinates');
        }

        return this.coordinates.map(coordinate => {
            const [ y, x ] = coordinate;

            switch (direction) {
                case Direction.Left:
                    return [ y, x - 1 ];

                case Direction.Right:
                    return [ y, x + 1 ];

                case Direction.Down:
                    return [ y + 1, x ];
            }
        });
    }

    /**
     * Rotate a 2 dimensional matrix 90 degrees.
     */
    rotate(rotation: ShapeRotation = ShapeRotation.Clockwise): void {
        const [ offsetY, offsetX ] = this.tetrominoStart;

        switch (rotation) {
            case ShapeRotation.CounterClockwise:
                this.tetromino = this.tetromino[0].map((val, index) => this.tetromino.map(row => row[row.length - 1 - index]));
                this.updateCoordinates(offsetY, offsetX);

                return;
            case ShapeRotation.Clockwise:
                this.tetromino = this.tetromino.map((val, index) => this.tetromino.map(row => row[index]).reverse());
                this.updateCoordinates(offsetY, offsetX);

                return;
        }

        throw new Error('Cannot rotate shape. Unsupported shape rotation');
    }

    /**
     * Update shape coordinates on playfield.
     *
     * @param [offsetY] - Offset shape down.
     * @param [offsetX] - Offset shape right.
     */
    updateCoordinates(offsetY: number = 0, offsetX: number = 0) {
        const coordinates: Coordinate[] = [];

        // iterate rows
        for (let y = 0; y < this.tetromino.length; y++) {
            const hasRowBlock = this.tetromino[y].some(block => block === 1);

            if (!hasRowBlock) {
                continue;
            }

            // iterate row cells
            for (let x = 0; x < this.tetromino[y].length; x++) {
                const block = this.tetromino[y][x];

                if (block === 1) {
                    coordinates.push([ y + offsetY, x + offsetX ]);
                }
            }
        }

        this.coordinates = coordinates;
    }

    offsetTetromino(direction: Direction): void {
        const [ y, x ] = this.tetrominoStart;

        // reflection symmetry
        const horizontal = this.tetromino[0].length;
        const vertical = this.tetromino.length;

        // playfield size
        const w = PlayfieldType.Width - horizontal;
        const h = PlayfieldType.Height - vertical;

        switch (direction) {
            case Direction.Left:
                if (x - 1 >= 0) {
                    this.tetrominoStart = [ y, x - 1 ];
                }

                break;
            case Direction.Right:
                if (x + 1 <= w) {
                    this.tetrominoStart = [ y, x + 1 ];
                }

                break;
            case Direction.Down:
                if (y + 1 <= h) {
                    this.tetrominoStart = [ y + 1, x ];
                }

                break;
        }
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
    color: Color = Color.Pink;
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
    color: Color = Color.Orange;
    tetromino: Matrix2D = [
        [ 0, 0, 1 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}

// ------ Additional shapes --------------

export class ShapeDot extends Shape {
    color: Color = Color.Sand;
    tetromino: Matrix2D = [
        [ 1 ],
    ];
}

export class ShapeX extends Shape {
    color: Color = Color.Slate;
    tetromino: Matrix2D = [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 1, 0 ],
    ];
}

export class ShapeU extends Shape {
    color: Color = Color.SteelBlue;
    tetromino: Matrix2D = [
        [ 1, 0, 1 ],
        [ 1, 1, 1 ],
        [ 0, 0, 0 ],
    ];
}

export class ShapeShortL extends Shape {
    color: Color = Color.Brown;
    tetromino: Matrix2D = [
        [ 1, 0 ],
        [ 1, 1 ],
    ];
}
