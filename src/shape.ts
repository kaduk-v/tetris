interface Shape {
    /**
     * Shape color.
     */
    color: string;
    // orientation: [];

}

enum ShapeOrientation {
    Up,
    Right,
    Left,
    Down
}

/**
 * Straight line. Shaped like a capital I.
 */
class I implements Shape {
    color = '#41bef8'
    orientation: {
        [ShapeOrientation.Up]: [
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
        ],
        [ShapeOrientation.Right]: [
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
        ],
        [ShapeOrientation.Down]: [
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
        ],
        [ShapeOrientation.Left]: [
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
        ],
    }
}

/**
 * Square shape. Shaped like a capital O.
 */
class O implements Shape {
    color = '#ffff43';
    orientation: {
        [ShapeOrientation.Up]: [
            [1,1],
            [1,1],
        ],
        [ShapeOrientation.Right]: [
            [1,1],
            [1,1],
        ],
        [ShapeOrientation.Down]: [
            [1,1],
            [1,1],
        ],
        [ShapeOrientation.Left]: [
            [1,1],
            [1,1],
        ],
    }
}

/**
 * A row of three Minos with one added above the center. Shaped like a capital T.
 */
class T implements Shape {
    color = '#7929f1'
}

/**
 * Two stacked horizontal diminos with the top one offset to the right. Shaped like a capital S.
 */
class S implements Shape {
    color = '#11ea44'
}

/**
 * Two stacked horizontal diminos with the top one offset to the left. Shaped like a capital Z.
 */
class Z implements Shape {
    color = '#f30000'
}

/**
 * A row of three Minos with one added above the left side. Shaped like a capital J.
 */
class J implements Shape {
    color = '#0662ea'
}

/**
 * A row of three Minos with one added above the right side. Shaped like a capital L.
 */
class L implements Shape {
    color = '#ea8706'
}
