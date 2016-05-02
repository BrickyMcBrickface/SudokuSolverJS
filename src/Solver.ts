import { Grid } from './Grid';
import { SolverState, SolverStateStack } from './SolverState';
import { Solution, NoSolution } from './Solution';
import { SolverUtility } from './SolverUtility';
import { GridSizeUtility } from './GridSizeUtility';

export class Solver {
    private readonly _grid: Grid;
    private _stateStack: SolverStateStack;
    
    public constructor(grid: Grid) {
        this._grid = grid;
        this._stateStack = new SolverStateStack(SolverState.create(grid));
    }
    
    public get grid(): Grid {
        return this._grid;
    }
    
    public nextSolution(log?: boolean): Solution | NoSolution {
        const complete = Math.pow(2, this._grid.gridSize.size) - 1;
        
        // Check for completeness.
        // This can happen when the grid is complete upon load.
        if(this._stateStack.current.boxes === complete) {
            let solution = Solution.create(this._grid, this._stateStack.items);
                
            // Revert the previous state (for the next solution...if any).
            this._stateStack.pop();
            
            return solution;
        }
        
        for(;;) {
            // Get the box, box cell, and box cell values from the current state.
            // Note: This could be zero if the state has not been initialized.
            let box: number = this._stateStack.current.currentBox;
            let boxCell: number = this._stateStack.current.currentBoxCell;
            let boxCellValues: number = this._stateStack.current.currentBoxCellValues;
            
            // Initial state load.
            if(this._stateStack.current.currentBox === 0) {
                // Get the next available box, box cell, and box cell values.
                box = this.getNextBox();
                boxCell = this.getNextBoxCell(box);
                boxCellValues = this.getBoxCellValues(box, boxCell);
                
                this._stateStack.current.currentBox = box;
                this._stateStack.current.currentBoxCell = boxCell;
                this._stateStack.current.currentBoxCellValues = boxCellValues;
            }
            
            if(boxCellValues === complete) {
                if(log) {
                    console.log(this._stateStack.currentIndex + '. ', 'No available values, popping.');
                }
                
                // Check if the current state is the same as the state stack current value.
                if(this._stateStack.current === this._stateStack.first) {
                    // This is the first item, there are no more solutions.
                    return new NoSolution();
                }
                
                // No available values.
                // Return to previous state.
                this._stateStack.pop();
                
                continue;
            }
            
            // Get the box cell value.
            let value: number = this.getNextValue(boxCellValues);
            
            // Try each available box cell value.
            for(; value < complete && boxCellValues !== complete; 
                boxCellValues |= value, value = this.getNextValue(boxCellValues)) {
                    
                // Keep track of the current permutation state.
                this._stateStack.current.currentBoxCellValue = value;
                this._stateStack.current.currentBoxCellValues = boxCellValues | value;
                
                // Keep track of state.
                this._stateStack.push(this._stateStack.current.clone());
                this._stateStack.current.currentBox = 0;
                this._stateStack.current.currentBoxCell = 0;
                this._stateStack.current.currentBoxCellValue = 0;
                this._stateStack.current.currentBoxCellValues = 0;
                
                // Get the row and column bits for the current box cell.
                let row = SolverUtility.getRowBitForBoxCell(box, boxCell, this._grid.gridSize);
                let column = SolverUtility.getColumnBitForBoxCell(box, boxCell, this._grid.gridSize);
                
                if(log) {
                    console.log(this._stateStack.currentIndex + '. ', 'Checking Box=', SolverUtility.getBoxNumberForBoxBit(box), 
                        'BoxCell=', SolverUtility.getBoxCellNumberForBoxCellBit(boxCell),
                        'Row=', GridSizeUtility.getBoxCellRow(this._grid.gridSize, 
                            SolverUtility.getBoxNumberForBoxBit(box),
                            SolverUtility.getBoxCellNumberForBoxCellBit(boxCell)),
                        'Col=', GridSizeUtility.getBoxCellColumn(this._grid.gridSize,
                            SolverUtility.getBoxNumberForBoxBit(box),
                            SolverUtility.getBoxCellNumberForBoxCellBit(boxCell)),
                        'Value=', SolverUtility.getValueForValueBit(value));
                }
                
                // Consume the value for the box cell.
                this._stateStack.current.boxCells[box] |= boxCell;
                this._stateStack.current.boxValues[box] |= value;
                this._stateStack.current.columnValues[column] |= value;
                this._stateStack.current.rowValues[row] |= value;
                
                // Check if the box is complete.
                if(this._stateStack.current.boxValues[box] === complete) {
                    this._stateStack.current.boxes |= box;
                }
                
                // Check for grid completeness.
                if(this._stateStack.current.boxes === complete) {
                    this._stateStack.pop();
                    
                    return Solution.create(this._grid, this._stateStack.items);
                }
                
                break;
            }
            
            // Check if nothing was found.
            if(value > complete || boxCellValues === complete) {
                if(log) {
                    console.log(this._stateStack.currentIndex + '. ', 'No more values to check, popping.');
                }
                
                // Check if the current state is the same as the state stack current value.
                if(this._stateStack.current === this._stateStack.first) {
                    // This is the first item, there are no more solutions.
                    return new NoSolution();
                }
                
                // Return to the previous state.
                this._stateStack.pop();
            }
        }
    }
    
    private getNextValue(values: number): number {
        return (values + 1) & ~values;
    }
    
    private getNextBox(): number {
        return (this._stateStack.current.boxes + 1) & ~this._stateStack.current.boxes;
    }
    
    private getNextBoxCell(box: number): number {
        const boxCells = this._stateStack.current.boxCells[box];
        
        return (boxCells + 1) & ~boxCells;
    }
    
    private getBoxCellValues(box: number, boxCell: number): number {
        const row = SolverUtility.getRowBitForBoxCell(box, boxCell, this._grid.gridSize);
        const column = SolverUtility.getColumnBitForBoxCell(box, boxCell, this._grid.gridSize);
        
        const rowValues = this._stateStack.current.rowValues[row];
        const columnValues = this._stateStack.current.columnValues[column];
        const boxValues = this._stateStack.current.boxValues[box];
        
        return rowValues | columnValues | boxValues;
    }
}