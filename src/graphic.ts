import {
    Color,
    Coordinate,
    defaultShapeBlock,
    emptyGridBlock,
    NextShapeType,
    PlayfieldType,
    ShapeBlock
} from "./config";

/**
 *
 */
export abstract class CanvasArea {
    protected _canvas: HTMLCanvasElement;
    protected _context: CanvasRenderingContext2D;

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    public constructor(selector: string, width: number, height: number) {
        this._canvas = document.querySelector(selector);

        this._canvas.height = height * PlayfieldType.BlockSide;
        this._canvas.width = width * PlayfieldType.BlockSide;

        this._context = this._canvas.getContext('2d');
    }

    /**
     * Draw one piece of shape by coordinates.
     *
     * @param [coordinate] Shape block coordinate.
     * @param [block] Shape block config.
     */
    public drawShapeBlock(coordinate: Coordinate, block: ShapeBlock) {
        const ctx = this._context;
        const targetBlock = { ...defaultShapeBlock, ...block };
        const { side, color } = targetBlock;

        // start block coordinates
        const x = coordinate[1] * side;
        const y = coordinate[0] * side;

        // outer border
        ctx.clearRect(x, y, side, side);

        // outer rectangle
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, side - 2, side - 2);

        // inner border
        ctx.clearRect(x + 2, y + 2, side - 5, side - 5);

        // inner rectangle
        ctx.fillStyle = color;
        ctx.fillRect(x + 5, y + 5, side - 10, side - 10);
    }

    public clearShapeBlock(coordinate: Coordinate) {
        this.drawShapeBlock(coordinate, { color: emptyGridBlock.color });
    }

    /**
     * Clear canvas area. Fill by empty shape blocks.
     */
    public abstract clearArea(): void;
}

class PlayfieldArea extends CanvasArea {
    clearArea(): void {
        const w = PlayfieldType.Width * PlayfieldType.BlockSide;
        const h = PlayfieldType.Height * PlayfieldType.BlockSide;

        this._context.clearRect(0, 0, w, h);
    }
}

class NextShapeArea extends CanvasArea {
    clearArea(): void {
        const w = NextShapeType.Width * NextShapeType.BlockSide;
        const h = NextShapeType.Height * NextShapeType.BlockSide;

        this._context.clearRect(0, 0, w, h);
    }
}

export class GraphicFactory {

    createPlayfieldArea(): PlayfieldArea {
        return new PlayfieldArea('#playfield', PlayfieldType.Width, PlayfieldType.Height);
    }

    createNextShapeArea(): NextShapeArea {
        return new NextShapeArea('#next-shape', NextShapeType.Width, NextShapeType.Height);
    }
}