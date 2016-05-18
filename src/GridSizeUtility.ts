import { GridSize } from './GridSize';

/**
 * Utility class for GridSize.
 */
export class GridSizeUtility {
    private constructor() { }
    
    /**
     * Gets the box band number.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} box - The box number.
     * @return {number} The box band number.
     */
    public static getBoxBand(gridSize: GridSize, box: number): number {
        return Math.floor((box - 1) / gridSize.bandSize) + 1;
    }
    
    /**
     * Gets the box stack number.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} box - The box number.
     * @return {number} The box stack number.
     */
    public static getBoxStack(gridSize: GridSize, box: number): number {
        return ((box - 1) % gridSize.bandSize) + 1;
    }
}