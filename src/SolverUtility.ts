import { GridLocation } from './GridLocation';
import { GridSize } from './GridSize';
import { BoxSize } from './BoxSize';
import { GridLocationFactory } from './GridLocationFactory';

/**
 * Utility class used by the Solver.
 */
export class SolverUtility {
    private constructor() { }
    
    /**
     * Gets the cell value bit value.
     * @param {number} value - The cell value.
     * @return {number} The bit value.
     */
    public static getValueBit(value: number): number {
        if(value === 0) {
            return 0;
        }
        
        return 1 << (value - 1);
    }
    
    /**
     * Gets the grid location row bit value.
     * @param {GridLocation} location - The grid location.
     * @return {number} The row bit value.
     */
    public static getRowBit(location: GridLocation): number {
        return 1 << (location.row - 1);
    }
    
    /**
     * Gets the grid location column bit value.
     * @param {GridLocation} location - The grid location.
     * @return {number} The column bit value.
     */
    public static getColumnBit(location: GridLocation): number {
        return 1 << (location.column - 1);
    }
    
    /**
     * Gets the grid location box bit value.
     * @param {GridLocation} location - The grid location.
     * @param {GridSize} gridSize - The grid size.
     * @return {number} The box bit value.
     */
    public static getBoxBit(location: GridLocation, gridSize: GridSize): number {
        const boxNumber = SolverUtility.getBoxNumber(location, gridSize);
        
        return 1 << (boxNumber - 1);
    }
    
    /**
     * Gets the grid location box-cell bit value.
     * @param {GridLocation} location - The grid location.
     * @param {BoxSize} boxSize - The box size.
     * @return {number} The box-cell bit value.
     */
    public static getBoxCellBit(location: GridLocation, boxSize: BoxSize) : number {
        const boxCellNumber = SolverUtility.getBoxCellNumber(location, boxSize);
        
        return 1 << (boxCellNumber - 1);
    }
    
    /**
     * Gets the grid location box number.
     * @param {GridLocation} location - The grid location.
     * @param {GridSize} gridSize - The grid size.
     * @return {number} The box number.
     */
    public static getBoxNumber(location: GridLocation, gridSize: GridSize): number {
        const stackNumber = SolverUtility.getStackNumber(location, gridSize.boxSize);
        const bandNumber = SolverUtility.getBandNumber(location, gridSize.boxSize);
        
        return stackNumber + gridSize.bandSize * (bandNumber - 1);
    }
    
    /**
     * Gets the grid location box-cell number.
     * @param {GridLocation} location - The grid location.
     * @param {BoxSize} boxSize - The box size.
     * @return {number} The box-cell number.
     */
    public static getBoxCellNumber(location: GridLocation, boxSize: BoxSize): number {
        const boxRowNumber = SolverUtility.getBoxRowNumber(location, boxSize);
        const boxColumnNumber = SolverUtility.getBoxColumnNumber(location, boxSize);
        
        return boxColumnNumber + boxSize.width * (boxRowNumber - 1);
    }
    
    /**
     * Gets the column number of a box for a grid location.
     * @param {GridLocation} location - The grid location.
     * @param {BoxSize} boxSize - The box size.
     * @return {number} The column number of the box.
     */
    public static getBoxColumnNumber(location: GridLocation, boxSize: BoxSize): number {
        return ((location.column - 1) % boxSize.width) + 1;
    }
    
    /**
     * Gets the row number of a box for a grid location.
     * @param {GridLocation} location - The grid location.
     * @param {BoxSize} boxSize - The box size.
     * @return {number} The row number of the box.
     */
    public static getBoxRowNumber(location: GridLocation, boxSize: BoxSize): number {
        return ((location.row - 1) % boxSize.height) + 1;
    }
    
    /**
     * Gets the stack number for a grid location.
     * @param {GridLocation} location - The grid location.
     * @param {BoxSize} boxSize - The box size.
     * @return {number} The stack number.
     */
    public static getStackNumber(location: GridLocation, boxSize: BoxSize): number {
        return Math.floor((location.column - 1) / boxSize.width) + 1;
    }
    
    /**
     * Gets the band number for a grid location.
     * @param {GridLocation} location - The grid location.
     * @param {BoxSize} boxSize - The box size.
     * @return {number} The band number.
     */
    public static getBandNumber(location: GridLocation, boxSize: BoxSize): number {
        return Math.floor((location.row - 1) / boxSize.height) + 1;
    }
    
    /**
     * Gets the row bit value for a box-cell bit value.
     * @param {number} boxBit - The box bit value.
     * @param {number} boxCellBit - The box-cell bit value.
     * @param {GridSize} gridSize - The grid size.
     * @return {number} The row bit value.
     */
    public static getRowBitForBoxCell(boxBit: number, boxCellBit: number, gridSize: GridSize): number {
        const box = SolverUtility.getBoxNumberForBoxBit(boxBit);
        const boxCell = SolverUtility.getBoxCellNumberForBoxCellBit(boxCellBit);
        const location = GridLocationFactory.createFromBoxCell(gridSize, box, boxCell);
        
        return SolverUtility.getRowBit(location);
    }
    
    /**
     * Gets the column bit value for a box-cell bit value.
     * @param {number} boxBit - The box bit value.
     * @param {number} boxCellBit - The box-cell bit value.
     * @param {GridSize} gridSize - The grid size.
     * @return {number} The column bit value.
     */
    public static getColumnBitForBoxCell(boxBit: number, boxCellBit: number, gridSize: GridSize): number {
        const box = SolverUtility.getBoxNumberForBoxBit(boxBit);
        const boxCell = SolverUtility.getBoxCellNumberForBoxCellBit(boxCellBit);
        const location = GridLocationFactory.createFromBoxCell(gridSize, box, boxCell);
        
        return SolverUtility.getColumnBit(location);
    }
    
    /**
     * Gets the box number for a box bit value.
     * @param {number} boxBit - The box bit value.
     * @return {number} The box number.
     */
    public static getBoxNumberForBoxBit(boxBit: number): number {
        return SolverUtility.log2(boxBit) + 1;
    }
    
    public static getRowNumberForRowBit(rowBit: number): number {
        return SolverUtility.log2(rowBit) + 1;
    }
    
    public static getColumnNumberForColumnBit(columnBit: number): number {
        return SolverUtility.log2(columnBit) + 1;
    }
    
    /**
     * Gets the box-cell number for a box-cell bit value.
     * @param {number} boxCellBit - The box-cell bit value.
     * @return {number} The box-cell number.
     */
    public static getBoxCellNumberForBoxCellBit(boxCellBit: number): number {
        return SolverUtility.log2(boxCellBit) + 1;
    }
    
    /**
     * Gets the cell value for a cell bit value.
     * @param {number} valueBit - The cell bit value.
     * @return {number} The cell value.
     */
    public static getValueForValueBit(valueBit: number): number {
        return SolverUtility.log2(valueBit) + 1;
    }
    
    /**
     * Gets the log base 2 of a value.
     * @param {number} value - The value.
     * @return {number} The log base 2 of the value.
     */
    private static log2(value: number): number {
        return Math.log(value) / Math.log(2);
    }
}