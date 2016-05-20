import { Grid } from './Grid';
import { GridSize } from './GridSize';
import { SolverUtility } from './SolverUtility';
import { GridUtility } from './GridUtility';
import { GridLocation } from './GridLocation';

/**
 * Grid solver.
 */
export class GridSolver {
    private readonly _grid: Grid;
    private readonly _state: SolverState;
    
    /**
     * Creates a new GridSolver object using a Grid.
     * @constructor
     * @param {Grid} grid - The grid to solve.
     */
    public constructor(grid: Grid) {
        this._grid = grid;
        this._state = new SolverState(grid);
    }
    
    /**
     * Solves the first solution of a Grid.
     * @return {GridSolution} The first solution of the grid.
     */
    public solve(): GridSolution {
        const state = this._state;
        
        for(let cell = state.current; cell !== undefined; cell = state.movePrevious()) {
            for(let valueFlag = cell.nextValueFlag(); valueFlag !== undefined; valueFlag = cell.nextValueFlag()) {
                // Get the next cell. If undefined, then the solution is complete.
                if((cell = state.moveNext()) === undefined) {
                    return new GridSolution(this._grid, state);
                }
            }
        }
        
        return undefined;
    }
}

/**
 * Grid solution.
 */
export class GridSolution {
    private readonly _originalGrid: Grid;
    private readonly _solvedGrid: Grid;
    
    /**
     * Gets the original grid used.
     * @return {Grid} The original grid.
     */
    public get originalGrid(): Grid {
        return this._originalGrid;
    }
    
    /**
     * Gets the solved grid.
     * @return {Grid} The solved grid.
     */
    public get solvedGrid(): Grid {
        return this._solvedGrid;
    }
    
    /**
     * Creates a new GridSolution object using a SolverState.
     * @constructor
     * @param {Grid} originalGrid - The original grid.
     * @param {SolverState} state - The grid solver state.
     */
    public constructor(originalGrid: Grid, state: SolverState) {
        this._originalGrid = originalGrid;

        let values: number[] = new Array(originalGrid.gridSize.cellCount);
        
        // Copy the existing grid values.
        for(let cell of originalGrid.cells) {
            if(cell.isEmpty()) {
                continue;
            }
            
            let index = GridUtility.getGridIndex(cell.location, originalGrid.gridSize);
            
            values[index] = cell.value;
        }
        
        // Copy the values from the state.
        for(let cell of state.cellStates) {
            let value = SolverUtility.getValueForValueBit(cell.valueFlag);
            
            let location = new GridLocation(cell.rowNumber, cell.columnNumber);
            let index = GridUtility.getGridIndex(location, originalGrid.gridSize);
            
            values[index] = value;
        }
        
        this._solvedGrid = Grid.load(originalGrid.gridSize, values);
    }
}

/**
 * GridSolver state.
 */
class SolverState {
    private readonly _boxValues: GroupValueFlagState[];
    private readonly _columnValues: GroupValueFlagState[];
    private readonly _rowValues: GroupValueFlagState[];
    
    private readonly _cellStates: CellState[];
    
    private _cellStateIndex: number = 0;
    private _lastCellStateIndex: number;
    
    /**
     * Gets the current cell state.
     * @return {CellState} The current cell state.
     */
    public get current(): CellState {
        return this._cellStates[this._cellStateIndex];
    }
    
    /**
     * Gets the cell states.
     * @return {CellState[]} The cell states.
     */
    public get cellStates(): CellState[] {
        return this._cellStates.concat([]);
    }
    
    /**
     * Creates a new SolverState object using a Grid.
     * @constructor
     * @param {Grid} grid - The grid. 
     */
    public constructor(grid: Grid) {
        const gridSize = grid.gridSize;
        const complete = ((1 << gridSize.size) >>> 0) - 1;
        
        this._boxValues = new Array(gridSize.size + 1);
        this._columnValues = new Array(gridSize.size + 1);
        this._rowValues = new Array(gridSize.size + 1);
        
        this._cellStates = [];
        
        for(let i = 1; i <= gridSize.size; i++) {
            this._boxValues[i] = new GroupValueFlagState(gridSize.cellCount);
            this._columnValues[i] = new GroupValueFlagState(gridSize.cellCount);
            this._rowValues[i] = new GroupValueFlagState(gridSize.cellCount);
        }
        
        for(let cell of grid.cells) {
            let location = cell.location;
            let boxNumber = SolverUtility.getBoxNumber(location, gridSize);
            let columnNumber = location.column;
            let rowNumber = location.row;
            
            if(!cell.isEmpty()) {
                let value = SolverUtility.getValueBit(cell.value);
                
                this._boxValues[boxNumber].push(value);
                this._columnValues[columnNumber].push(value);
                this._rowValues[rowNumber].push(value);
                
                continue;
            }
            
            let cellState = new CellState(
                boxNumber, rowNumber, columnNumber,
                this._boxValues[boxNumber], this._rowValues[rowNumber], this._columnValues[columnNumber], complete);
                
            // TODO: Sort the cells by box rather than use the default order.
            this._cellStates.push(cellState);
        }
        
        this._lastCellStateIndex = this._cellStates.length - 1;
        
        // Initialize the first cell state.
        this.current.recalculateValueFlags();
    }
    
    /**
     * Moves to and prepares the next cell.
     * @return {CellState | undefined} The next cell or undefined if no more available cells.
     */
    public moveNext(): CellState | undefined {
        const currentCell = this._cellStates[this._cellStateIndex];
        
        currentCell.assignValueFlag();
        
        if(this._cellStateIndex === this._lastCellStateIndex) {
            return undefined;
        }
        
        const nextCell = this._cellStates[++this._cellStateIndex];
        
        nextCell.recalculateValueFlags();
        
        return nextCell;
    }
    
    /**
     * Moves to the previous valid cell.
     * @return {CellState | undefined} The previous valid cell or undefined if no more valid cells.
     */
    public movePrevious(): CellState | undefined {
        if(this._cellStateIndex === 0) {
            return undefined;
        }
        
        for(let previousCell = this._cellStates[--this._cellStateIndex]; 
            previousCell !== undefined; 
            previousCell = this._cellStates[--this._cellStateIndex]) {
            
            previousCell.unassignValueFlag();
        
            if(previousCell.isComplete()) {
                continue;
            }
            
            return previousCell;
        }
        
        if(this._cellStateIndex < 0) {
            this._cellStateIndex = 0;
        }
        
        return undefined;
    }
}

/**
 * Group (box, row, column) value flag state.
 */
class GroupValueFlagState {
    private readonly _items: number[];
    private _index: number = 0;
    
    /**
     * Gets the current value flags.
     * @return {number} The current value flags.
     */
    public get valueFlags(): number {
        return this._items[this._index];
    }
    
    /**
     * Creates a new GroupValueFlagState object.
     * @constructor
     * @param {number} size - The size of the grid.
     */
    public constructor(size: number) {
        this._items = new Array(size);
        this._items[0] = 0;
    }
    
    /**
     * Pushes a new value flag in the state by bitwise-or the current value flags.
     * @param {number} valueFlag - The value flag.
     * @return {number} The new value flags.
     */
    public push(valueFlag: number): number {
        const currentValueFlags = this._items[this._index];
        
        return this._items[++this._index] = currentValueFlags | valueFlag;
    }
    
    /**
     * Pops the current value flags in the state.
     * @return {number} The previous value flags.
     */
    public pop(): number {
        return this._items[--this._index];
    }
}

/**
 * Cell state.
 */
class CellState {
    private readonly _boxNumber: number;
    private readonly _columnNumber: number;
    private readonly _rowNumber: number;
    
    private readonly _boxValueState: GroupValueFlagState;
    private readonly _columnValueState: GroupValueFlagState;
    private readonly _rowValueState: GroupValueFlagState;
    
    private _valueFlag: number;
    private _valueFlags: number;
    
    private _complete: number;
    
    /**
     * Gets the box number of the cell.
     * @return {number} The box number.
     */
    public get boxNumber(): number {
        return this._boxNumber;
    }
    
    /**
     * Gets the column number of the cell.
     * @return {number} The column number.
     */
    public get columnNumber(): number {
        return this._columnNumber;
    }
    
    /**
     * Gets the row number of the cell.
     * @return {number} The row number.
     */
    public get rowNumber(): number {
        return this._rowNumber;
    }
    
    /**
     * Gets the current value flag of the cell.
     * @return {number} The current value flag.
     */
    public get valueFlag(): number {
        return this._valueFlag;
    }
    
    /**
     * Creates a new CellState object.
     * @constructor
     * @param {number} boxNumber - The cell box number.
     * @param {number} rowNumber - The cell row number.
     * @param {number} columnNumber - The cell column number.
     * @param {GroupValueFlagState} boxValueState - The box value state
     * @param {GroupValueFlagState} columnValueState - The column value state.
     * @param {GroupValueFlagState} rowValueState - The row value state.
     * @param {number} complete - The value flags complete flags.
     */
    public constructor(
        boxNumber: number, rowNumber: number, columnNumber: number,
        boxValueState: GroupValueFlagState, rowValueState: GroupValueFlagState, columnValueState: GroupValueFlagState, complete: number) {
            
        this._boxNumber = boxNumber;
        this._rowNumber = rowNumber;
        this._columnNumber = columnNumber;
        
        this._boxValueState = boxValueState;
        this._rowValueState = rowValueState;
        this._columnValueState = columnValueState;
        
        this._complete = complete;
    }
    
    /**
     * Gets if the cell is complete.
     * @return {boolean} True if complete, false otherwise.
     */
    public isComplete(): boolean {
        return this._valueFlags === this._complete;
    }
    
    /**
     * Assigns the current value flag to the box, column, and row value states.
     */
    public assignValueFlag() {
        this._boxValueState.push(this._valueFlag);
        this._columnValueState.push(this._valueFlag);
        this._rowValueState.push(this._valueFlag);
    }
    
    /**
     * Unassigns the current value flag from the box, column, and row value states.
     */
    public unassignValueFlag() {
        this._boxValueState.pop();
        this._columnValueState.pop();
        this._rowValueState.pop();
    }
    
    /**
     * Recalculates the value flags for the cell using the box, column, and row value states.
     */
    public recalculateValueFlags() {
        this._valueFlags = 
            this._boxValueState.valueFlags |
            this._columnValueState.valueFlags |
            this._rowValueState.valueFlags;
            
        this._valueFlag = 0;
    }
    
    /**
     * Gets the next value flag and adjusts the value flags.
     * @return {number} The next value flag.
     */
    public nextValueFlag(): number {
        if(this._valueFlags === this._complete) {
            return undefined;
        }
        
        this._valueFlags |= (this._valueFlag = (this._valueFlags + 1) & ~this._valueFlags);
        
        return this._valueFlag;
    }
}