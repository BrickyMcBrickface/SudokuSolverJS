import { GridLocation } from './GridLocation';
import { GridSize } from './GridSize';

export class GridUtility {
    private constructor() { }
    
    public static getGridIndex(location: GridLocation, gridSize: GridSize): number {
        return (location.row - 1) * gridSize.size + (location.column - 1);
    }
    
    public static getRowFromIndex(gridSize: GridSize, index: number): number {
        return Math.floor(index / gridSize.size) + 1;
    }
    
    public static getColumnFromIndex(gridSize: GridSize, index: number): number {
        return (index % gridSize.size) + 1;
    }
}