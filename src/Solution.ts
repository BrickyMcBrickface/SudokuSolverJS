import { Grid } from './Grid';
import { SolverState } from './SolverState';
import { SolverUtility } from './SolverUtility';
import { GridLocationFactory } from './GridLocationFactory';
import { GridUtility } from './GridUtility';

export class Solution {
    private readonly _originalGrid: Grid;
    private _grid: Grid;
    
    private constructor(originalGrid: Grid) {
        this._originalGrid = originalGrid;
    }
    
    public get originalGrid(): Grid {
        return this._originalGrid;
    }
    
    public get grid(): Grid {
        return this._grid;
    }
    
    public static create(grid: Grid, stateItems: SolverState[]): Solution {
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
        for(let state of stateItems) {
            let box = SolverUtility.getBoxNumberForBoxBit(state.currentBox);
            let boxCell = SolverUtility.getBoxCellNumberForBoxCellBit(state.currentBoxCell);
            let value = SolverUtility.getValueForValueBit(state.currentBoxCellValue);
            
            let location = GridLocationFactory.createFromBoxCell(grid.gridSize, box, boxCell);
            let index = GridUtility.getGridIndex(location, grid.gridSize);
            
            values[index] = value;
        }
        
        solution._grid = Grid.load(grid.gridSize, values);
        
        return solution;
    }
}

export class NoSolution { }