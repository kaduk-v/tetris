import * as _ from "lodash";
import { Color, Coordinate, emptyGridBlock, GridMatrix2D, Matrix2D, PlayfieldType } from "./config";

export const hasMatrix2DElement = (matrix: Matrix2D, row: number, col: number): boolean => {
    return matrix[row] !== undefined && matrix[row][col] !== undefined;
}

export const issetCoordinate = (coordinates: Coordinate[], y: number, x: number): boolean => {
    return coordinates.filter((coordinate: Coordinate) => coordinate[0] === y && coordinate[1] === x).length > 0;
}

export const random = (list: any[]) => {
    return _.sample(_.shuffle(list).reverse());
}

export const emptyGrig = (height: number, width: number): GridMatrix2D => {
    return [ ...Array(height) ].map(e => Array(width).fill(emptyGridBlock))
}

export const emptyMatrix2D = (height: number, width: number): Matrix2D => {
    return [ ...Array(height) ].map(e => Array(width).fill(0))
}
