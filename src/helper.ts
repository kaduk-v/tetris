import { Matrix2D } from "./shape";
import { Coordinate } from "./config";

export const has2DMatrixElement = (matrix: Matrix2D, row: number, col: number): boolean => {
    return matrix[row] !== undefined && matrix[row][col] !== undefined;
}

export const issetCoordinate = (coordinates: Coordinate[], y: number, x: number): boolean => {
    return coordinates.filter((coordinate: Coordinate) => coordinate[0] === y && coordinate[1] === x).length > 0;
}