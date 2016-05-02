import { BoxSize } from './BoxSize';

export class BoxSizeUtility {
    private constructor() { }
    
    public static getBoxCellRow(boxSize: BoxSize, boxCell: number): number {
        return Math.floor((boxCell - 1) / boxSize.width) + 1;
    }
    
    public static getBoxCellColumn(boxSize: BoxSize, boxCell: number): number {
        return ((boxCell - 1) % boxSize.width) + 1;
    }
}