import { Grid } from './Grid';
import { SolverUtility } from './SolverUtility';

/**
 * SolverState box/column/row value state stack.
 */
class SolverStatePropertyStack {
    private _values: number[] = [];
    private _index: number = 0;
    
    /**
     * Gets the values.
     * @return {number[]} The stack values.
     */
    public get values(): number[] {
        return this._values.concat([]);
    }
    
    /**
     * Gets the current stack index.
     * @return {number} The current stack index.
     */
    public get index(): number {
        return this._index;
    }
    
    /**
     * Gets the current stack value.
     * @return {number} The current stack value.
     */
    public get currentValue(): number {
        return this._values[this._index];
    }
    
    /**
     * Adds a new value to the stack and returns it along with the previous values.
     * @param {number} value - The value to add.
     * @return {number} The newly added value plus the previous values.
     */
    public push(value: number): number {
        const currentValue = this._values[this._index];
        
        return this._values[++this._index] = currentValue | value;
    }
    
    /**
     * Moves to the previous stack value.
     */
    public pop() {
        this._index--;
    }
}

export class SolverState {
    private _items: SolverStateItem[] = [];
    private _itemsIndex: number = -1;
    
    public boxes: SolverStatePropertyStack = new SolverStatePropertyStack();
    public boxCells: { [box: number]: SolverStatePropertyStack } = { };
    public boxValues: { [box: number]: SolverStatePropertyStack } = { };
    public columnValues: { [column: number]: SolverStatePropertyStack } = { };
    public rowValues: { [row: number]: SolverStatePropertyStack } = { };

    public complete: number;
    
    private constructor() { }
    
    public get currentItem(): SolverStateItem {
        if(this._itemsIndex < 0) {
            return undefined;
        }
        
        return this._items[this._itemsIndex];
    }
    
    public get items(): SolverStateItem[] {
        return this._items.concat([]);
    }
    
    public push(item: SolverStateItem) {
        this._items[++this._itemsIndex] = item;
        
        if(item.boxCells.push(item.boxCell) === this.complete) {
            this.boxes.push(item.box);
        }
        else this.boxes.push(0);
        
        item.boxValues.push(item.boxCellValue);
        item.columnValues.push(item.boxCellValue);
        item.rowValues.push(item.boxCellValue);
    }
    
    public pop(): SolverStateItem {
        for(;;) {
            if(this._itemsIndex < 0) {
                return undefined;
            }
        
            const item = this.currentItem;
            
            this.boxes.pop();
            
            item.boxCells.pop();
            item.boxValues.pop();
            item.columnValues.pop();
            item.rowValues.pop();
            
            this._itemsIndex--;
            
            // Keep popping until something can be used.
            if(item.boxCellValues === this.complete) {
                continue;
            }
            
            return item;
        }
    }
    
    public static createFromGrid(grid: Grid): SolverState {
        let state = new SolverState();
        
        state.complete = ((1 << grid.gridSize.size) >>> 0) - 1;
        
        for(let cell of grid.cells) {
            const location = cell.location;
            
            const row = SolverUtility.getRowBit(location);
            const column = SolverUtility.getColumnBit(location);
            const box = SolverUtility.getBoxBit(location, grid.gridSize);
            const boxCell = SolverUtility.getBoxCellBit(location, grid.gridSize.boxSize);
            const value = SolverUtility.getValueBit(cell.value);
            
            if(!state.boxValues[box]) {
                state.boxValues[box] = new SolverStatePropertyStack();
            }
            
            if(!state.boxCells[box]) {
                state.boxCells[box] = new SolverStatePropertyStack;
            }
            
            if(!state.columnValues[column]) {
                state.columnValues[column] = new SolverStatePropertyStack();
            }
            
            if(!state.rowValues[row]) {
                state.rowValues[row] = new SolverStatePropertyStack();
            }
            
            state.boxValues[box].push(value);
            state.columnValues[column].push(value);
            state.rowValues[row].push(value);
            
            if(!cell.isEmpty()) {
                state.boxCells[box].push(boxCell);
            }
            
            if(state.boxCells[box].currentValue === state.complete) {
                state.boxes.push(box);
            }
        }
        
        if(state.boxes.currentValue === undefined) {
            state.boxes.push(0);
        }
        
        return state;
    }
}

export class SolverStateItem {
    public box: number = 0;
    public boxCell: number = 0;
    public column: number = 0;
    public row: number = 0;
    
    public boxCellValue: number = 0;
    public boxCellValues: number = 0;
    
    public boxCells: SolverStatePropertyStack;
    public boxValues: SolverStatePropertyStack;
    public columnValues: SolverStatePropertyStack;
    public rowValues: SolverStatePropertyStack;
}