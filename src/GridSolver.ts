import { Grid } from './Grid';
import { GridSize } from './GridSize';
import { SolverUtility } from './SolverUtility';
import { GridUtility } from './GridUtility';
import { GridLocation } from './GridLocation';

export class GridSolver {
    private readonly _grid: Grid;
    private readonly _state: SolverState;
    
    public constructor(grid: Grid) {
        this._grid = grid;
        this._state = new SolverState(grid);
    }
    
    public solve(): GridSolution {
        const state = this._state;
        
        for(let cell = state.current; ; ) {
            for(let valueFlag = cell.nextValueFlag(); valueFlag !== undefined; valueFlag = cell.nextValueFlag()) {
                // Get the next cell. If undefined, then the solution is complete.
                if((cell = state.moveNext()) === undefined) {
                    return new GridSolution(this._grid, state);
                }
            }
            
            // No more available values.
            if((cell = state.movePrevious()) === undefined) {
                return undefined;
            }
        }
    }
}

export class GridSolution {
    private readonly _originalGrid: Grid;
    private readonly _solvedGrid: Grid;
    
    public get originalGrid(): Grid {
        return this._originalGrid;
    }
    
    public get solvedGrid(): Grid {
        return this._solvedGrid;
    }
    
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

class SolverState {
    private readonly _boxValues: GroupValueFlagState[];
    private readonly _columnValues: GroupValueFlagState[];
    private readonly _rowValues: GroupValueFlagState[];
    
    private readonly _cellStates: CellState[];
    
    private _cellStateIndex: number = 0;
    private _lastCellStateIndex: number;
    
    public get current(): CellState {
        return this._cellStates[this._cellStateIndex];
    }
    
    public get cellStates(): CellState[] {
        return this._cellStates.concat([]);
    }
    
    public constructor(grid: Grid) {
        const gridSize = grid.gridSize;
        const complete = ((1 << gridSize.size) >>> 0) - 1;
        
        this._boxValues = new Array(gridSize.size + 1);
        this._columnValues = new Array(gridSize.size + 1);
        this._rowValues = new Array(gridSize.size + 1);
        
        this._cellStates = [];
        //this._cellStates = new Array(gridSize.cellCount);
        
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
    
    public moveNext(): CellState {
        const currentCell = this._cellStates[this._cellStateIndex];
        
        currentCell.assignValueFlag();
        
        if(this._cellStateIndex === this._lastCellStateIndex) {
            return undefined;
        }
        
        const nextCell = this._cellStates[++this._cellStateIndex];
        
        nextCell.recalculateValueFlags();
        
        return nextCell;
    }
    
    public movePrevious(): CellState {
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

class GroupValueFlagState {
    private readonly _items: number[];
    private _index: number = 0;
    
    public get valueFlags(): number {
        return this._items[this._index];
    }
    
    public constructor(size: number) {
        this._items = new Array(size);
        this._items[0] = 0;
    }
    
    public push(valueFlag: number): number {
        const currentValueFlags = this._items[this._index];
        
        return this._items[++this._index] = currentValueFlags | valueFlag;
    }
    
    public pop(): number {
        return this._items[--this._index];
    }
}

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
    
    public get boxNumber(): number {
        return this._boxNumber;
    }
    
    public get columnNumber(): number {
        return this._columnNumber;
    }
    
    public get rowNumber(): number {
        return this._rowNumber;
    }
    
    public get valueFlag(): number {
        return this._valueFlag;
    }
    
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
    
    public isComplete(): boolean {
        return this._valueFlags === this._complete;
    }
    
    public assignValueFlag() {
        this._boxValueState.push(this._valueFlag);
        this._columnValueState.push(this._valueFlag);
        this._rowValueState.push(this._valueFlag);
    }
    
    public unassignValueFlag() {
        this._boxValueState.pop();
        this._columnValueState.pop();
        this._rowValueState.pop();
    }
    
    public recalculateValueFlags() {
        this._valueFlags = 
            this._boxValueState.valueFlags |
            this._columnValueState.valueFlags |
            this._rowValueState.valueFlags;
            
        this._valueFlag = 0;
    }
    
    public nextValueFlag(): number {
        if(this._valueFlags === this._complete) {
            return undefined;
        }
        
        this._valueFlags |= (this._valueFlag = (this._valueFlags + 1) & ~this._valueFlags);
        
        return this._valueFlag;
    }
}