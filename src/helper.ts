import { Matrix2D } from "./shape";
import { Coordinate } from "./config";
import * as _ from "lodash";

export const hasMatrix2DElement = (matrix: Matrix2D, row: number, col: number): boolean => {
    return matrix[row] !== undefined && matrix[row][col] !== undefined;
}

export const issetCoordinate = (coordinates: Coordinate[], y: number, x: number): boolean => {
    return coordinates.filter((coordinate: Coordinate) => coordinate[0] === y && coordinate[1] === x).length > 0;
}

export const random = (list: any[]) => {
    return _.sample(list);
}