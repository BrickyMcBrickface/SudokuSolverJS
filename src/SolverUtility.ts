import { GridLocation } from './GridLocation';
import { GridSize } from './GridSize';
import { BoxSize } from './BoxSize';
import { GridLocationFactory } from './GridLocationFactory';

export class SolverUtility {
    private constructor() { }
    
    public static getValueBit(value: number): number {
        if(value === 0) {
            return 0;
        }
        
        return 1 << (value - 1);
    }
    
    public static getRowBit(location: GridLocation): number {
        return 1 << (location.row - 1);
    }
    
    public static getColumnBit(location: GridLocation): number {
        return 1 << (location.column - 1);
    }
    
    public static getBoxBit(location: GridLocation, gridSize: GridSize): number {
        const boxNumber = SolverUtility.getBoxNumber(location, gridSize);
        
        return 1 << (boxNumber - 1);
    }
    
    public static getBoxCellBit(location: GridLocation, boxSize: BoxSize) : number {
        const boxCellNumber = SolverUtility.getBoxCellNumber(location, boxSize);
        
        return 1 << (boxCellNumber - 1);
    }
    
    public static getBoxNumber(location: GridLocation, gridSize: GridSize): number {
        const stackNumber = SolverUtility.getStackNumber(location, gridSize.boxSize);
        const bandNumber = SolverUtility.getBandNumber(location, gridSize.boxSize);
        
        return stackNumber + gridSize.bandSize * (bandNumber - 1);
    }
    
    public static getBoxCellNumber(location: GridLocation, boxSize: BoxSize): number {
        const boxRowNumber = SolverUtility.getBoxRowNumber(location, boxSize);
        const boxColumnNumber = SolverUtility.getBoxColumnNumber(location, boxSize);
        
        return boxColumnNumber + boxSize.width * (boxRowNumber - 1);
    }
    
    public static getBoxColumnNumber(location: GridLocation, boxSize: BoxSize): number {
        return ((location.column - 1) % boxSize.width) + 1;
    }
    
    public static getBoxRowNumber(location: GridLocation, boxSize: BoxSize): number {
        return ((location.row - 1) % boxSize.height) + 1;
    }
    
    public static getStackNumber(location: GridLocation, boxSize: BoxSize): number {
        return Math.floor((location.column - 1) / boxSize.width) + 1;
    }
    
    public static getBandNumber(location: GridLocation, boxSize: BoxSize): number {
        return Math.floor((location.row - 1) / boxSize.height) + 1;
    }
    
    public static getRowBitForBoxCell(boxBit: number, boxCellBit: number, gridSize: GridSize): number {
        const box = SolverUtility.getBoxNumberForBoxBit(boxBit);
        const boxCell = SolverUtility.getBoxCellNumberForBoxCellBit(boxCellBit);
        const location = GridLocationFactory.createFromBoxCell(gridSize, box, boxCell);
        
        return SolverUtility.getRowBit(location);
    }
    
    public static getColumnBitForBoxCell(boxBit: number, boxCellBit: number, gridSize: GridSize): number {
        const box = SolverUtility.getBoxNumberForBoxBit(boxBit);
        const boxCell = SolverUtility.getBoxCellNumberForBoxCellBit(boxCellBit);
        const location = GridLocationFactory.createFromBoxCell(gridSize, box, boxCell);
        
        return SolverUtility.getColumnBit(location);
    }
    
    public static getBoxNumberForBoxBit(boxBit: number): number {
        return SolverUtility.log2(boxBit) + 1;
    }
    
    public static getBoxCellNumberForBoxCellBit(boxCellBit: number): number {
        return SolverUtility.log2(boxCellBit) + 1;
    }
    
    public static getValueForValueBit(valueBit: number): number {
        return SolverUtility.log2(valueBit) + 1;
    }
    
    private static log2(value: number): number {
        return Math.log(value) / Math.log(2);
    }
}