/**
 * @param [number] Y-Axis. First element.
 * @param [number] X-Axis. Second element.
 */
export type Coordinate = [ number, number ];

export interface PlayfieldBlock {
    color?: Color;
    width?: number;
    height?: number;
    borderColor?: Color;
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
    LineWidth = 0.1, // block stroke
    BlockSide = 25, // 25px
    MovementSpeed = 1000 // 1 sec
}

export enum Color {
    Blue = '#0662ea',
    Green = '#37ab0c',
    Gray = '#535360',
    LightBlue = '#41bef8',
    Purple = '#7929f1',
    Orange = '#ea8706',
    Red = '#f30000',
    White = '#ffffff',
    Yellow = '#fff000',
}



