import { Color, Coordinate, Playfield, PlayfieldBlock } from "./config";
import { Matrix2D } from "./shape";

const defaultBlock: PlayfieldBlock = {
    color: Color.LightGray,
    width: Playfield.BlockSide,
    height: Playfield.BlockSide,
}

class Graphic {
    private static instance: Graphic;

    public static canvas: HTMLCanvasElement;
    public static context: CanvasRenderingContext2D;

    public static canvasSide: HTMLCanvasElement;
    public static contextSide: CanvasRenderingContext2D;

    public static score: HTMLElement;
    public static lines: HTMLElement;
    public static level: HTMLElement;

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

        Graphic.canvas = document.querySelector('#playfield');
        Graphic.canvasSide = document.querySelector('#next-shape');

        Graphic.score = document.querySelector('.side-panel .score .value');
        Graphic.lines = document.querySelector('.side-panel .lines .value');
        Graphic.level = document.querySelector('.side-panel .level .value');

        Graphic.canvas.height = Playfield.Height * Playfield.BlockSide;
        Graphic.canvas.width = Playfield.Width * Playfield.BlockSide;

        Graphic.canvasSide.height = 3 * Playfield.BlockSide;
        Graphic.canvasSide.width = 4 * Playfield.BlockSide;

        Graphic.instance = new Graphic();
        Graphic.context = Graphic.canvas.getContext('2d');

        Graphic.contextSide = Graphic.canvasSide.getContext('2d');

        return Graphic.instance;
    }

    public static draw(coordinate: Coordinate, block: PlayfieldBlock) {
        const ctx = Graphic.context;
        const x = coordinate[1] * Playfield.BlockSide;
        const y = coordinate[0] * Playfield.BlockSide;

        const targetBlock = { ...defaultBlock, ...block };

        // shape block full size
        const { width, height } = targetBlock;

        // outer border
        ctx.clearRect(x, y, width, height);

        // outer rectangle
        ctx.fillStyle = targetBlock.color;
        ctx.fillRect(x + 1, y + 1, width - 2, height - 2);

        // inner border
        ctx.clearRect(x + 2, y + 2, width - 5, height - 5);

        // inner rectangle
        ctx.fillStyle = targetBlock.color;
        ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    }

    public static drawSide(coordinate: Coordinate, block: PlayfieldBlock) {
        const ctx = Graphic.contextSide;
        const x = coordinate[1] * Playfield.BlockSide;
        const y = coordinate[0] * Playfield.BlockSide;

        const targetBlock = { ...defaultBlock, ...block };

        // shape block full size
        const { width, height } = targetBlock;

        // outer border
        ctx.clearRect(x, y, width, height);

        // outer rectangle
        ctx.fillStyle = targetBlock.color;
        ctx.fillRect(x + 1, y + 1, width - 2, height - 2);

        // inner border
        ctx.clearRect(x + 2, y + 2, width - 5, height - 5);

        // inner rectangle
        ctx.fillStyle = targetBlock.color;
        ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    }

    public static clear(coordinate: Coordinate, block: PlayfieldBlock = defaultBlock) {
        Graphic.draw(coordinate, { color: Color.LightGray });
    }

    public static clearPlayfield() {
        Graphic.context.clearRect(0, 0, Playfield.Width * Playfield.BlockSide, Playfield.Height * Playfield.BlockSide);
    }
}

Graphic.getInstance();

export { Graphic };
