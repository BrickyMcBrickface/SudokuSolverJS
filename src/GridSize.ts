/**
 * Represents the grid dimensions.
 */
export class GridSize {
    private readonly _boxWidth: number;
    private readonly _boxHeight: number;
    
    private readonly _size: number;
    
    /**
     * Creates a new GridSize object.
     * @constructor
     * @param {number} boxWidth - The box width.
     * @param {number} boxHeight - The box height.
     */
    public constructor(boxWidth: number, boxHeight: number) {
        this._boxWidth = boxWidth;
        this._boxHeight = boxHeight;
        this._size = boxWidth * boxHeight;
    }
    
    /**
     * Gets the box width of the grid.
     * @return {number} The grid's box width.
     */
    public get boxWidth(): number {
        return this._boxWidth;
    }
    
    /**
     * Gets the box height of the grid.
     * @return {number} The grid's box height.
     */
    public get boxHeight(): number {
        return this._boxHeight;
    }
    
    /**
     * Gets the size of the grid (width and height).
     * @return {number} The grid's size.
     */
    public get size(): number {
        return this._size;
    }
    
    /**
     * Gets the number of cells in the grid.
     * @return {number} The number of cells in the grid.
     */
    public get cellCount(): number {
        return this.size * this.size;
    }
    
    /**
     * Gets the band size of the grid in number of boxes.
     * @return {number} The grid's band size.
     */
    public get bandSize(): number {
        return this._boxHeight;
    }
    
    /**
     * Gets the stack size of the grid in number of boxes.
     * @return {number} The grid's stack size.
     */
    public get stackSize(): number {
        return this._boxWidth;
    }
    
    /** Default 9x9 Sudoku puzzle grid size. */
    public static readonly Default: GridSize = new GridSize(3, 3);
}