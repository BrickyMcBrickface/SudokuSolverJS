import { BoxSize } from './BoxSize';

/**
 * Utility class for BoxSize.
 */
export class BoxSizeUtility {
    private constructor() { }
    
    /**
     * Gets a box-cell row number.
     * @param {BoxSize} boxSize - The box size.
     * @param {number} boxCell - The box-cell number.
     * @return {number} The box-cell row number.
     */
    public static getBoxCellRow(boxSize: BoxSize, boxCell: number): number {
        return Math.floor((boxCell - 1) / boxSize.width) + 1;
    }
    
    /**
     * Gets a box-cell column number.
     * @param {BoxSize} boxSize - The box size.
     * @param {number} boxCell - The box-cell number.
     * @return {number} The box-cell column number.
     */
    public static getBoxCellColumn(boxSize: BoxSize, boxCell: number): number {
        return ((boxCell - 1) % boxSize.width) + 1;
    }
}