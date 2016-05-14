import { Grid } from './Grid';
import { SolverStateItem } from './SolverState';
import { SolverUtility } from './SolverUtility';
import { GridLocationFactory } from './GridLocationFactory';
import { GridUtility } from './GridUtility';

/**
 * Represents a solution for a grid.
 */
export class Solution {
    private readonly _originalGrid: Grid;
    private _grid: Grid;
    
    /**
     * Creates a new Solution object.
     * @constructor
     * @param {Grid} originalGrid - The original grid.
     */
    private constructor(originalGrid: Grid) {
        this._originalGrid = originalGrid;
    }
    
    /**
     * Gets the original grid.
     * @return {Grid} The original grid.
     */
    public get originalGrid(): Grid {
        return this._originalGrid;
    }
    
    /**
     * Gets the solution grid.
     * @return {Grid} The solution grid.
     */
    public get grid(): Grid {
        return this._grid;
    }
    
    /**
     * Creates and populates a new Solution object using solver state.
     * @param {Grid} grid - The original grid.
     * @param {SolverStateItem[]} items - The array of solver state items.
     * @return {Solution} The solution.
     */
    public static create(grid: Grid, items: SolverStateItem[]): Solution {
        let solution = new Solution(grid);

        let values: number[] = new Array(grid.gridSize.cellCount);
        
        // Copy the existing grid values.
        for(let cell of grid.cells) {
            if(cell.isEmpty()) {
                continue;
            }
            
            let index = GridUtility.getGridIndex(cell.location, grid.gridSize);
            
            values[index] = cell.value;
        }
        
        // Copy the values from the state.
        for(let state of items) {
            let box = SolverUtility.getBoxNumberForBoxBit(state.box);
            let boxCell = SolverUtility.getBoxCellNumberForBoxCellBit(state.boxCell);
            let value = SolverUtility.getValueForValueBit(state.boxCellValue);
            
            let location = GridLocationFactory.createFromBoxCell(grid.gridSize, box, boxCell);
            let index = GridUtility.getGridIndex(location, grid.gridSize);
            
            values[index] = value;
        }
        
        solution._grid = Grid.load(grid.gridSize, values);
        
        return solution;
    }
}

/**
 * Represents a no solution outcome.
 */
export class NoSolution { }