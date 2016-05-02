import { GridSize } from './GridSize';
import { Cell } from './Cell';
import { GridLocationFactory } from './GridLocationFactory';

/**
 * Cell factory methods.
 */
export class CellFactory {
    private constructor() { }
    
    /**
     * Creates a new Cell object using a zero-based Grid index.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} index - The zero-based index of the cell.
     * @param {number} value - The cell value.
     * @return {Cell} A Cell object.
     */
    public static createFromGridIndex(gridSize: GridSize, index: number, value: number): Cell {
        const location = GridLocationFactory.createFromGridIndex(gridSize, index);
        
        return new Cell(location, value);
    }
}