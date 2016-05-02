import { GridSize } from './GridSize';
import { Cell } from './Cell';
import { GridLocationFactory } from './GridLocationFactory';

export class CellFactory {
    private constructor() { }
    
    public static createFromGridIndex(gridSize: GridSize, index: number, value: number): Cell {
        const location = GridLocationFactory.createFromGridIndex(gridSize, index);
        
        return new Cell(location, value);
    }
}