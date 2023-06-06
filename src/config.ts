/**
 * @param [number] Y-Axis. First element.
 * @param [number] X-Axis. Second element.
 */
export type Coordinate = [ number, number ];

export interface PlayfieldBlock {
    color?: Color;
    width?: number;
    height?: number;
}

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
    LinesPerLevel = 3
}

export const maxLine = 10;
export const maxLevel = 5;

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

export enum Playfield {
    Width = 10,
    Height = 20,
    LineWidth = 1, // block stroke
    BlockSide = 25, // 25px
    MovementSpeed = 1000 // 1 sec
}

export enum Color {
    Blue = '#0662EA',
    BlueGray = '#91A2C2',
    Green = '#37AB0C',
    Gray = '#808080',
    LightGray = 'rgba(153,153,153,0.12)',
    LightBlue = '#41BEF8',
    Purple = 'rgba(121,41,241,0.9)',
    Orange = '#EA8706',
    Red = '#f30000',
    White = '#FFFFFF',
    Sand = '#E1BE7C',
    Pink = '#E67CF1',
    Slate = '#7184A5',
}

