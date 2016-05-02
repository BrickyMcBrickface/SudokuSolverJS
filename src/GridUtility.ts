import { GridLocation } from './GridLocation';
import { GridSize } from './GridSize';

/**
 * Utility class for Grid.
 */
export class GridUtility {
    private constructor() { }
    
    /**
     * Gets the zero-based grid index for a grid location.
     * @param {GridLocation} location - The grid location.
     * @param {GridSize} gridSize - The grid size.
     * @return {number} The zero-based grid index.
     */
    public static getGridIndex(location: GridLocation, gridSize: GridSize): number {
        return (location.row - 1) * gridSize.size + (location.column - 1);
    }
    
    /**
     * Gets the row number for a zero-based grid index.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} index - The zero-based grid index.
     * @return {number} The row number.
     */
    public static getRowFromIndex(gridSize: GridSize, index: number): number {
        return Math.floor(index / gridSize.size) + 1;
    }
    
    /**
     * Gets the column number for a zero-based grid index.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} index - The zero-based grid index.
     * @return {number} The column number.
     */
    public static getColumnFromIndex(gridSize: GridSize, index: number): number {
        return (index % gridSize.size) + 1;
    }
}