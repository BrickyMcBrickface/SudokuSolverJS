import { Grid } from './Grid';
import { GridSize } from './GridSize';
import { SolverState, SolverStateItem } from './SolverState';
import { Solution, NoSolution } from './Solution';
import { SolverUtility } from './SolverUtility';
import { GridSizeUtility } from './GridSizeUtility';

/**
 * Grid solver.
 */
export class Solver {
    private readonly _grid: Grid;
    private readonly _state: SolverState;
    private readonly _cache: SolverCache;
    
    /**
     * Creates a new Solver object.
     * @param {Grid} grid - The grid.
     */
    public constructor(grid: Grid) {
        // Validate the grid size.
        if(grid.gridSize.size > 32) {
            throw 'Grid is too large. Maxiumum grid size is 32x32';
        }
        
        this._grid = grid;
        this._state = SolverState.createFromGrid(grid);
        this._cache = new SolverCache(grid.gridSize);
    }
    
    /**
     * Gets the grid.
     * @return {Grid} The grid.
     */
    public get grid(): Grid {
        return this._grid;
    }
    
    /**
     * Attempts to solve the first solution for a grid.
     * @param {boolean} log - True to log the output; False otherwise.
     * @return {Solution | undefined} A Solution object (if found); otherwise, undefined.
     */
    public solve(): Solution | undefined {
        const grid = this._grid;
        const state = this._state;
        const complete = this._state.complete;
        
        // TODO: Check for a complete board.
        
        mainLoop: for(let currentItem = this.getNextItem(state); ; ) {
            // Try each available box cell value.
            for(currentItem.boxCellValue = (currentItem.boxCellValues + 1) & ~currentItem.boxCellValues;
                currentItem.boxCellValues !== complete; 
                currentItem.boxCellValues |= currentItem.boxCellValue, 
                currentItem.boxCellValue = (currentItem.boxCellValues + 1) & ~currentItem.boxCellValues) {
                
                // Keep track of the current permutation state.
                currentItem.boxCellValues |= currentItem.boxCellValue;
                
                state.push(currentItem);
                
                // Check for grid completeness.
                if(state.boxes.currentValue === complete) {
                    return Solution.create(grid, state.items);
                }
                
                // Set the next state.
                if((currentItem = this.getNextItem(state)) === undefined) {
                    return undefined;
                }
                
                continue mainLoop;
            }
            
            // Nothing found for current state, go to a previous state.
            if((currentItem = state.pop()) === undefined) {
                // No previous state could be found, return nothing.
                return undefined;
            }
        }
    }
    
    /**
     * Gets the next solver state item.
     * @param {SolverState} state - The solver state.
     * @return {SolverStateItem} A SolverStateItem object.
     */
    private getNextItem(state: SolverState): SolverStateItem {
        let item = new SolverStateItem();
        
        // Get the next available box.
        item.box = (state.boxes.currentValue + 1) & ~state.boxes.currentValue;
        
        // Keep track of the box and box-cell references.
        item.boxCells = state.boxCells[item.box];
        item.boxValues = state.boxValues[item.box];
        
        // Get the next available box-cell.
        item.boxCell = (item.boxCells.currentValue + 1) & ~item.boxCells.currentValue;
        
        // Calculate the row and column for the box-cell.
        item.column = this._cache.getColumnBitForBoxCell(item.box, item.boxCell);
        item.row = this._cache.getRowBitForBoxCell(item.box, item.boxCell);
        
        // Keep track of the row and column references.
        item.columnValues = state.columnValues[item.column];
        item.rowValues = state.rowValues[item.row];
        
        // Calculate the box-cell available values.
        item.boxCellValues = 
            item.boxValues.currentValue |
            item.columnValues.currentValue |
            item.rowValues.currentValue;
         
        // Validate the next item. If it cannot be used, then go to a previous state.
        if(item.boxCellValues === state.complete) {
            return state.pop();
        }
        
        return item;
    }
}

/**
 * Solver cache.
 */
class SolverCache {
    private readonly _gridSize: GridSize;
    
    private _boxCellToColumnCache: { [box: number]: { [boxCell: number]: number } } = { };
    private _boxCellToRowCache: { [box: number]: { [boxCell: number]: number } } = { };
    
    /**
     * Creates a new SolverCache object.
     * @constructor
     * @param {GridSize} gridSize - The grid size.
     */
    public constructor(gridSize: GridSize) {
        this._gridSize = gridSize;
    }
    
    /**
     * Gets the column bit for a box-cell.
     * @param {number} box - The box bit.
     * @param {number} boxCell - The box-cell bit.
     * @return {number} The column bit.
     */
    public getColumnBitForBoxCell(box: number, boxCell: number): number {
        let boxCache = this._boxCellToColumnCache[box];
        
        if(boxCache === undefined) {
            boxCache = this._boxCellToColumnCache[box] = { };
            
            return boxCache[boxCell] = SolverUtility.getColumnBitForBoxCell(box, boxCell, this._gridSize);
        }
        
        let column = boxCache[boxCell];
        
        if(column === undefined) {
            return boxCache[boxCell] = SolverUtility.getColumnBitForBoxCell(box, boxCell, this._gridSize);
        }
        
        return column;
    }
    
    /**
     * Gets the row bit for a box-cell.
     * @param {number} box - The box bit.
     * @param {number} boxCell - The box-cell bit.
     * @return {number} The row bit.
     */
    public getRowBitForBoxCell(box: number, boxCell: number): number {
        let boxCache = this._boxCellToRowCache[box];
        
        if(boxCache === undefined) {
            boxCache = this._boxCellToRowCache[box] = { };
            
            return boxCache[boxCell] = SolverUtility.getRowBitForBoxCell(box, boxCell, this._gridSize);
        }
        
        let row = boxCache[boxCell];
        
        if(row === undefined) {
            return boxCache[boxCell] = SolverUtility.getRowBitForBoxCell(box, boxCell, this._gridSize);
        }
        
        return row;
    }
}