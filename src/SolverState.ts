import { Grid } from './Grid';
import { SolverUtility } from './SolverUtility';

export class SolverState {
    public boxes: number = 0;
    public boxCells: { [bit: number]: number } = { };
    public boxValues: { [bit: number]: number } = { };
    public columnValues: { [bit: number]: number } = { };
    public rowValues: { [bit: number]: number } = { };
    
    public currentBoxCellValues: number = 0;
    public currentBoxCellValue: number = 0;
    public currentBoxCell: number = 0;
    public currentBox: number = 0;
        
    private constructor() { }
    
    public clone(): SolverState {
        let state = new SolverState();
        
        state.boxes = this.boxes;
        
        SolverState.copy(this.boxCells, state.boxCells);
        SolverState.copy(this.boxValues, state.boxValues);
        SolverState.copy(this.columnValues, state.columnValues);
        SolverState.copy(this.rowValues, state.rowValues);
        
        state.currentBox = this.currentBox;
        state.currentBoxCell = this.currentBoxCell;
        state.currentBoxCellValue = this.currentBoxCellValue;
        state.currentBoxCellValues = this.currentBoxCellValues;
        
        return state;
    }
    
    public static create(grid: Grid): SolverState {
        let state = new SolverState();
        
        const complete = Math.pow(2, grid.gridSize.size) - 1;
        
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
    
    private static copy(input: { [bit: number]: number }, output: { [bit: number]: number }) {
        Object.keys(input).forEach(key => output[key] = input[key]);
    }
}

export class SolverStateStack {
    private readonly _items: SolverState[] = [];
    private _currentItemIndex: number = 0;
    
    public constructor(initialState: SolverState) {
        this._items.push(initialState);
    }
    
    public get first(): SolverState {
        return this._items[0];
    }
    
    public get last(): SolverState {
        return this._items[this._currentItemIndex];
    }
    
    public get current(): SolverState {
        return this._items[this._currentItemIndex];
    }
    
    public get currentIndex(): number {
        return this._currentItemIndex;
    }
    
    public get items(): SolverState[] {
        return this._items.concat([]);
    }
    
    public push(state: SolverState) {
        this._items.push(state);
        this._currentItemIndex++;
    }
    
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