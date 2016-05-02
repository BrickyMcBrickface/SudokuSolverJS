/**
 * Represents the box dimensions for a grid.
 */
export class BoxSize {
    private readonly _width: number;
    private readonly _height: number;
    
    /**
     * Creates a new BoxSize object.
     * @constructor
     * @param {number} width - The width of the box.
     * @param {number} height - The height of the box.
     */
    public constructor(width: number, height: number) {
        if(width <= 0) throw 'Box size width is invalid.';
        if(height <= 0) throw 'Box size height is invalid.';
        
        this._width = width;
        this._height = height;
    }
    
    /**
     * Gets the width of the box.
     * @return {number} The box width.
     */
    public get width(): number {
        return this._width;
    }
    
    /**
     * Gets the height of the box.
     * @return {number} The box height.
     */
    public get height(): number {
        return this._height;
    }
    
    /**
     * Gets the number of cells in the box.
     * @return {number} The number of cells in the box.
     */
    public get cellCount(): number {
        return this.width * this.height;
    }
    
    /** Default 3x3 Sudoku puzzle box size. */
    public static readonly Default: BoxSize = new BoxSize(3, 3);
}