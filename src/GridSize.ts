import { BoxSize } from './BoxSize';

/**
 * Represents the grid dimensions.
 */
export class GridSize {
    private readonly _boxSize: BoxSize;
    
    /**
     * Creates a new GridSize object.
     * @constructor
     * @param {BoxSize} boxSize - The box size of the grid.
     */
    public constructor(boxSize: BoxSize) {
        this._boxSize = boxSize;
    }
    
    /**
     * Gets the box size of the grid.
     * @return {BoxSize} The Grid's box size.
     */
    public get boxSize(): BoxSize {
        return this._boxSize;
    }
    
    /**
     * Gets the grid's size (width and height).
     * @return {number} The size of the grid.
     */
    public get size(): number {
        return this.boxSize.width * this.boxSize.height;
    }
    
    /**
     * Gets the number of cells in the grid.
     * @return {number} The number of cells in the grid.
     */
    public get cellCount(): number {
        return this.size * this.size;
    }
    
    /**
     * Gets the grid's band size in number of boxes.
     * @return {number} The band size of the grid.
     */
    public get bandSize(): number {
        return this.boxSize.height;
    }
    
    /**
     * Gets the grid's stack size in number of boxes.
     * @return {number} The stack size of the grid.
     */
    public get stackSize(): number {
        return this.boxSize.width;
    }
    
    /** Default 9x9 Sudoku puzzle grid size. */
    public static readonly Default: GridSize = new GridSize(BoxSize.Default);
}