// ========================== ENUMS ==========================

/**
 * Shape movement direction.
 */
export enum Direction {
    Up,
    Right,
    Left,
    Down
}

export enum Score {
    Shape = 10,
    LinesPerLevel = 3 // to get next level
}

/**
 * Keyboard code.
 */
export enum Key {
    Space = 'Space',
    Left = 'ArrowLeft',
    Right = 'ArrowRight',
    Up = 'ArrowUp',
    Down = 'ArrowDown',
    A = 'KeyA',
    S = 'KeyS',
    D = 'KeyD',
    W = 'KeyW'
}

export enum ShapeRotation {
    Clockwise = 1,
    CounterClockwise = 2,
}

export enum PlayfieldType {
    Width = 10,
    Height = 20,
    BlockSide = 25, // 25px
    MovementSpeed = 1000 // 1 sec
}

export enum NextShapeType {
    Width = 4,
    Height = 3,
    BlockSide = 25
}

export enum Color {
    Blue = '#0662EA',
    Brown = '#A52A2A',
    Green = '#37AB0C',
    Gray = '#808080',
    LightGray = 'rgba(153,153,153,0.12)',
    LightBlue = '#41BEF8',
    Purple = 'rgba(121,41,241,0.9)',
    Orange = '#EA8706',
    Red = '#f30000',
    Sand = '#E1BE7C',
    SteelBlue = '#4682B4',
    Pink = '#E67CF1',
    Slate = '#7184A5',
    White = '#FFFFFF',
}

/**
 * Shape block (formerly Square) - is one piece of shape.
 */
export type ShapeBlock = {
    color: Color;
    side?: number;
}

// ========================== TYPES ==========================

/**
 * Two-dimensional matrix.
 */
export type Matrix2D = number[][];

export type GridBlock = {
    color: Color,
    filled: boolean
}

export type GridMatrix2D = GridBlock[][];

/**
 * @param [number] Y-Axis. First element.
 * @param [number] X-Axis. Second element.
 */
export type Coordinate = [ number, number ];


// ========================== CONSTANTS ==========================

export const highlightedLineBlock: GridBlock = {
    color: Color.Gray,
    filled: true
}

export const emptyGridBlock: GridBlock = {
    color: Color.LightGray,
    filled: false,
}

export const defaultShapeBlock: ShapeBlock = {
    color: Color.LightGray,
    side: PlayfieldType.BlockSide,
}

export const maxLine = 10;
export const maxLevel = 5;
export const levelSpeed = ~~(PlayfieldType.MovementSpeed / maxLevel);