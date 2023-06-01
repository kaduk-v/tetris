import { Color, Coordinate, Playfield, PlayfieldBlock } from "./config";

const defaultBlock: PlayfieldBlock = {
    color: Color.White,
    width: Playfield.BlockSide,
    height: Playfield.BlockSide,
    borderColor: Color.Gray
}

class Graphic {
    private static instance: Graphic;

    public static canvas: HTMLCanvasElement;
    public static context: CanvasRenderingContext2D;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
    }

    /**
     * The static method that controls the access to the singleton instance.
     */
    public static getInstance(): Graphic {
        if (Graphic.instance) {
            return Graphic.instance;
        }

        Graphic.canvas = document.createElement('canvas');

        Graphic.canvas.height = Playfield.Height * Playfield.BlockSide;
        Graphic.canvas.width = Playfield.Width * Playfield.BlockSide;

        Graphic.instance = new Graphic();
        Graphic.context = Graphic.canvas.getContext('2d');

        return Graphic.instance;
    }

    public static draw(coordinate: Coordinate, block: PlayfieldBlock) {
        const x = coordinate[1] * Playfield.BlockSide;
        const y = coordinate[0] * Playfield.BlockSide;

        const targetBlock = { ...defaultBlock, ...block };

        // draw rectangle
        Graphic.context.fillStyle = targetBlock.color;
        Graphic.context.fillRect(x, y, targetBlock.width, targetBlock.height);

        // Graphic.context.clearRect(x, y, 1, 1);

        // draw rectangle border
        Graphic.context.strokeStyle = targetBlock.borderColor;
        Graphic.context.lineWidth = Playfield.LineWidth;
        Graphic.context.strokeRect(x, y, targetBlock.width, targetBlock.height);

    }

    public static clear(coordinate: Coordinate, block: PlayfieldBlock) {
        const x = coordinate[1] * Playfield.BlockSide;
        const y = coordinate[0] * Playfield.BlockSide;

        const targetBlock = { ...defaultBlock, ...block };

        // clear rectangle
        Graphic.context.clearRect(x, y, targetBlock.width, targetBlock.height);

        // draw rectangle border
        Graphic.context.strokeStyle = targetBlock.borderColor;
        Graphic.context.lineWidth = Playfield.LineWidth;
        Graphic.context.strokeRect(x, y, targetBlock.width, targetBlock.height);
    }
}

Graphic.getInstance();

export { Graphic };