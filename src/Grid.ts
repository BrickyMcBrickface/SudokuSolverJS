import { GridSize } from './GridSize';
import { Cell } from './Cell';
import { CellFactory } from './CellFactory';

/**
 * Represents the grid.
 */
export class Grid {
    private readonly _gridSize: GridSize;
    private readonly _cells: Cell[];
    
    /**
     * Creates a new Grid object.
     * @constructor
     * @param {GridSize} gridSize - The grid size.
     */
    private constructor(gridSize: GridSize) {
        this._gridSize = gridSize;
        this._cells = new Array(gridSize.cellCount);
    }
    
    /**
     * Gets the grid size.
     * @return {GridSize} The grid size.
     */
    public get gridSize(): GridSize {
        return this._gridSize;
    }
    
    /**
     * Gets the cells in the grid.
     * @return {Cell[]} The grid cells.
     */
    public get cells(): Cell[] {
        return this._cells.concat([]);
    }
    
    /**
     * Converts the grid to a string.
     * @return {string} Comma-separated list of cell values.
     */
    public toString(): string {
        return this._cells.map(cell => cell.value).join(',');
    }
    
    /**
     * Factory method for creating a new Grid object using an array of cell values.
     * @param {GridSize} gridSize - The grid size.
     * @param {number[]} values - The array of cell values.
     * @return {Grid} A Grid object.
     */
    public static load(gridSize: GridSize, values: number[]): Grid {
        if(values.length === 0) throw 'No values are present';
        if(values.length !== gridSize.cellCount) throw 'Invalid number of values';
        
        let grid = new Grid(gridSize);
        
        for(let i = 0; i < gridSize.cellCount; i++) {
            let cell = CellFactory.createFromGridIndex(gridSize, i, values[i]);
            
            grid._cells[i] = cell;
        }
        
        return grid;
    }
}