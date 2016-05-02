import { GridSize } from './GridSize';
import { Cell } from './Cell';
import { CellFactory } from './CellFactory';

export class Grid {
    private readonly _gridSize: GridSize;
    private readonly _cells: Cell[];
    
    private constructor(gridSize: GridSize) {
        this._gridSize = gridSize;
        this._cells = new Array(gridSize.cellCount);
    }
    
    public get gridSize(): GridSize {
        return this._gridSize;
    }
    
    public get cells(): Cell[] {
        return this._cells.concat([]);
    }
    
    public toString(): string {
        return this._cells.map(cell => cell.value).join(',');
    }
    
    public static load(gridSize: GridSize, values: number[]): Grid {
        if(values.length === 0) throw 'No values are present';
        if(values.length !== gridSize.cellCount) throw 'Invalid number of values';
        
        let grid = new Grid(gridSize);
        
        for(let i = 0; i < gridSize.cellCount; i++) {
            let cell = CellFactory.createFromGridIndex(gridSize, i, values[i]);
            
            grid._cells[i] = cell;
        }
        
        return grid;
    }
}