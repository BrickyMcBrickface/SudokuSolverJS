import { GridSize } from './GridSize';
import { BoxSizeUtility } from './BoxSizeUtility';

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
    
    /**
     * Gets the box-cell row number.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} box - The box number.
     * @param {number} boxCell - The box-cell number.
     * @return {number} The box-cell row number.
     */
    public static getBoxCellRow(gridSize: GridSize, box: number, boxCell: number): number {
        const band = GridSizeUtility.getBoxBand(gridSize, box);
        const boxCellRow = BoxSizeUtility.getBoxCellRow(gridSize.boxSize, boxCell);
        const boxRow = (band - 1) * gridSize.boxSize.height + 1;
        
        return boxRow + (boxCellRow - 1);
    }
    
    /**
     * Gets the box-cell column number.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} box - The box number.
     * @param {number} boxCell - The box-cell number.
     * @return {number} The box-cell column number.
     */
    public static getBoxCellColumn(gridSize: GridSize, box: number, boxCell: number): number {
        const stack = GridSizeUtility.getBoxStack(gridSize, box);
        const boxCellColumn = BoxSizeUtility.getBoxCellColumn(gridSize.boxSize, boxCell);
        const boxColumn = (stack - 1) * gridSize.boxSize.width + 1;
        
        return boxColumn + (boxCellColumn - 1);
    }
}