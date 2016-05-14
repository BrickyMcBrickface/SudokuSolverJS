import { Grid } from './Grid';
import { SolverUtility } from './SolverUtility';

class SolverStateProperty {
    private _values: number[] = [];
    private _index: number = 0;
    
    public get values(): number[] {
        return this._values.concat([]);
    }
    
    public get index(): number {
        return this._index;
    }
    
    public get currentValue(): number {
        return this._values[this._index];
    }
    
    public push(value: number): number {
        const currentValue = this._values[this._index];
        
        return this._values[++this._index] = currentValue | value;
    }
    
    public pop() {
        this._index--;
    }
}

export class SolverState {
    private _items: SolverStateItem[] = [];
    private _itemsIndex: number = -1;
    
    public boxes: SolverStateProperty = new SolverStateProperty();
    public boxCells: { [box: number]: SolverStateProperty } = { };
    public boxValues: { [box: number]: SolverStateProperty } = { };
    public columnValues: { [column: number]: SolverStateProperty } = { };
    public rowValues: { [row: number]: SolverStateProperty } = { };

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
        
        if(this.boxCells[item.box].push(item.boxCell) === this.complete) {
            this.boxes.push(item.box);
        }
        else this.boxes.push(0);
        
        this.boxValues[item.box].push(item.boxCellValue);
        this.columnValues[item.column].push(item.boxCellValue);
        this.rowValues[item.row].push(item.boxCellValue);
    }
    
    public pop(): SolverStateItem {
        if(this._itemsIndex < 0) {
            return undefined;
        }
        
        const item = this.currentItem;
        
        this.boxes.pop();
        this.boxCells[item.box].pop();
        this.boxValues[item.box].pop();
        this.columnValues[item.column].pop();
        this.rowValues[item.row].pop();
        
        this._itemsIndex--;
        
        return item;
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
                state.boxValues[box] = new SolverStateProperty();
            }
            
            if(!state.boxCells[box]) {
                state.boxCells[box] = new SolverStateProperty();
            }
            
            if(!state.columnValues[column]) {
                state.columnValues[column] = new SolverStateProperty();
            }
            
            if(!state.rowValues[row]) {
                state.rowValues[row] = new SolverStateProperty();
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
}