import { GridSize } from './GridSize';
import { BoxSizeUtility } from './BoxSizeUtility';

export class GridSizeUtility {
    private constructor() { }
    
    public static getBoxBand(gridSize: GridSize, box: number): number {
        return Math.floor((box - 1) / gridSize.bandSize) + 1;
    }
    
    public static getBoxStack(gridSize: GridSize, box: number): number {
        return ((box - 1) % gridSize.bandSize) + 1;
    }
    
    public static getBoxCellRow(gridSize: GridSize, box: number, boxCell: number): number {
        const band = GridSizeUtility.getBoxBand(gridSize, box);
        const boxCellRow = BoxSizeUtility.getBoxCellRow(gridSize.boxSize, boxCell);
        const boxRow = (band - 1) * gridSize.boxSize.height + 1;
        
        return boxRow + (boxCellRow - 1);
    }
    
    public static getBoxCellColumn(gridSize: GridSize, box: number, boxCell: number): number {
        const stack = GridSizeUtility.getBoxStack(gridSize, box);
        const boxCellColumn = BoxSizeUtility.getBoxCellColumn(gridSize.boxSize, boxCell);
        const boxColumn = (stack - 1) * gridSize.boxSize.width + 1;
        
        return boxColumn + (boxCellColumn - 1);
    }
}