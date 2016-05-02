import { GridSize } from './GridSize';
import { GridLocation } from './GridLocation';
import { GridSizeUtility } from './GridSizeUtility';
import { GridUtility } from './GridUtility';

export class GridLocationFactory {
    private constructor() { }
    
    public static createFromGridIndex(gridSize: GridSize, index: number): GridLocation {
        const row = GridUtility.getRowFromIndex(gridSize, index);
        const column = GridUtility.getColumnFromIndex(gridSize, index);
        
        return new GridLocation(row, column);
    }
    
    public static createFromBoxCell(gridSize: GridSize, box: number, boxCell: number): GridLocation {
        const row = GridSizeUtility.getBoxCellRow(gridSize, box, boxCell);
        const column = GridSizeUtility.getBoxCellColumn(gridSize, box, boxCell);
        
        return new GridLocation(row, column);
    }
}