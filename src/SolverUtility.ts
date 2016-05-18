import { GridLocation } from './GridLocation';
import { GridSize } from './GridSize';
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
     * Gets the grid location box number.
     * @param {GridLocation} location - The grid location.
     * @param {GridSize} gridSize - The grid size.
     * @return {number} The box number.
     */
    public static getBoxNumber(location: GridLocation, gridSize: GridSize): number {
        const stackNumber = SolverUtility.getStackNumber(location, gridSize);
        const bandNumber = SolverUtility.getBandNumber(location, gridSize);
        
        return stackNumber + gridSize.bandSize * (bandNumber - 1);
    }
    
    /**
     * Gets the stack number for a grid location.
     * @param {GridLocation} location - The grid location.
     * @param {GridSize} gridSize - The grid size.
     * @return {number} The stack number.
     */
    public static getStackNumber(location: GridLocation, gridSize: GridSize): number {
        return Math.floor((location.column - 1) / gridSize.boxWidth) + 1;
    }
    
    /**
     * Gets the band number for a grid location.
     * @param {GridLocation} location - The grid location.
     * @param {GridSize} gridSize - The grid size.
     * @return {number} The band number.
     */
    public static getBandNumber(location: GridLocation, gridSize: GridSize): number {
        return Math.floor((location.row - 1) / gridSize.boxHeight) + 1;
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