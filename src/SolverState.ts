import { Grid } from './Grid';
import { SolverUtility } from './SolverUtility';

export interface SolverStateKeyValuePair {
    [bit: number]: number
}

/**
 * Handles the state for the Solver.
 */
export class SolverState {
    /** The available and used boxes. */
    public boxes: number = 0;
    /** The available and used box-cells per box. */
    public boxCells: SolverStateKeyValuePair = { };
    /** The available and used box values per box. */
    public boxValues: SolverStateKeyValuePair = { };
    /** The available and used column values per column. */
    public columnValues: SolverStateKeyValuePair = { };
    /** The available and used row values per row. */
    public rowValues: SolverStateKeyValuePair = { };
    
    /** The current box-cell available values. */
    public currentBoxCellValues: number = 0;
    /** The current box-cell value. */
    public currentBoxCellValue: number = 0;
    /** The current box-cell. */
    public currentBoxCell: number = 0;
    /** The current box. */
    public currentBox: number = 0;
    
    /**
     * Creates a new SolverState object.
     * @constructor
     */
    private constructor() { }
    
    /**
     * Factory method for creating a SolverState object using a grid.
     * @param {Grid} grid - The grid.
     * @return {SolverState} A SolverState object.
     */
    public static createFromGrid(grid: Grid): SolverState {
        let state = new SolverState();
        
        const complete = ((1 << grid.gridSize.size) >>> 0) - 1;
        
        for(let cell of grid.cells) {
            let location = cell.location;
            
            let row = SolverUtility.getRowBit(location);
            let column = SolverUtility.getColumnBit(location);
            let box = SolverUtility.getBoxBit(location, grid.gridSize);
            let boxCell = SolverUtility.getBoxCellBit(location, grid.gridSize.boxSize);
            let value = SolverUtility.getValueBit(cell.value);
            
            state.rowValues[row] |= value;
            state.columnValues[column] |= value;
            state.boxValues[box] |= value;
            
            if(!cell.isEmpty()) {
                state.boxCells[box] |= boxCell;
            }
            
            if(state.boxValues[box] === complete) {
                state.boxes |= box;
            }
        }
        
        return state;
    }
    
    /**
     * Factory method for creating a SolverState object using a SolverState object.
     * @param {SolverState} - The solver state to create from.
     * @return {SolverState} A SolverState object.
     */
    public static createFromState(state: SolverState): SolverState {
        let nextState = new SolverState();
        
        nextState.boxes = state.boxes;
        
        Object.assign(nextState.boxCells, state.boxCells);
        Object.assign(nextState.boxValues, state.boxValues);
        Object.assign(nextState.columnValues, state.columnValues);
        Object.assign(nextState.rowValues, state.rowValues);
        
        nextState.currentBox = state.currentBox;
        nextState.currentBoxCell = state.currentBoxCell;
        nextState.currentBoxCellValue = state.currentBoxCellValue;
        nextState.currentBoxCellValues = state.currentBoxCellValues;
        
        return nextState;
    }
    
    /**
     * Copies key-value pairs from one object to another.
     * @param {} input - The source object.
     * @param {} output - The target object.
     */
    private static copy(input: SolverStateKeyValuePair, output: SolverStateKeyValuePair) {
        Object.keys(input).forEach(key => output[key] = input[key]);
    }
}

/**
 * Handles the multiple state items for the Solver.
 */
export class SolverStateStack {
    private readonly _items: SolverState[] = [];
    private _currentItemIndex: number = 0;
    
    /**
     * Creates a new SolverStateStack object.
     * @param {SolverState} initialState - The initial state item.
     */
    public constructor(initialState: SolverState) {
        this._items.push(initialState);
    }
    
    /**
     * Gets the first state item in the stack.
     * @return {SolverState} The first state item.
     */
    public get first(): SolverState {
        return this._items[0];
    }
    
    /**
     * Gets the last state item in the stack.
     * @return {SolverState} The last state item.
     */
    public get last(): SolverState {
        return this._items[this._currentItemIndex];
    }
    
    /**
     * Gets the current state item in the stack.
     * @return {SolverState} The current state item.
     */
    public get current(): SolverState {
        return this._items[this._currentItemIndex];
    }
    
    /**
     * Gets the current stack index.
     * @return {number} The current stack index.
     */
    public get currentIndex(): number {
        return this._currentItemIndex;
    }
    
    /**
     * Gets the items in the stack.
     * @return {SolverState[]} The stack items.
     */
    public get items(): SolverState[] {
        return this._items.concat([]);
    }
    
    /**
     * Pushes a state item on the stack.
     * @param {SolverState} state - The state item.
     */
    public push(state: SolverState) {
        this._items.push(state);
        this._currentItemIndex++;
    }
    
    /**
     * Pops a state item off the stack.
     * @return {SolverState} The removed state item.
     */
    public pop(): SolverState {
        // If there is only one item left, leave it.
        // TODO: Possibly do this another way.
        if(this._currentItemIndex == 0) {
            return this.current;
        }
        
        const state = this._items.pop();
        
        this._currentItemIndex--;
        
        return state;
    }
}