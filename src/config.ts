/**
 * Y-Axis. First element.
 * X-Axis. Second element.
 */
export type Coordinate = [ number, number ];

export enum ShapeOrientation {
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
    LineHeight = 0.1,
    ShapeBlockSize = 25, // 25px
    MovementSpeed = 1000 // 1 sec
}

export enum Color {
    Blue = '#0662ea',
    Green = '#37ab0c',
    LightBlue = '#41bef8',
    Purple = '#7929f1',
    Orange = '#ea8706',
    Red = '#f30000',
    White = '#ffffff',
    Yellow = '#ffff43',
}


