import { GridSize } from './GridSize';
import { GridLocation } from './GridLocation';
import { GridSizeUtility } from './GridSizeUtility';
import { GridUtility } from './GridUtility';

/**
 * GridLocation factory methods.
 */
export class GridLocationFactory {
    private constructor() { }
    
    /**
     * Creates a new GridLocation object using a zero-based grid index.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} index - The zero-based index of the cell.
     * @return {GridLocation} A GridLocation object.
     */
    public static createFromGridIndex(gridSize: GridSize, index: number): GridLocation {
        const row = GridUtility.getRowFromIndex(gridSize, index);
        const column = GridUtility.getColumnFromIndex(gridSize, index);
        
        return new GridLocation(row, column);
    }
    
    /**
     * Creates a new GridLocation object using a box cell.
     * @param {GridSize} gridSize - The grid size.
     * @param {number} box - The box number.
     * @param {number} boxCell - The box-cel number.
     * @return {GridLocation} A GridLocation object.
     */
    public static createFromBoxCell(gridSize: GridSize, box: number, boxCell: number): GridLocation {
        const row = GridSizeUtility.getGridBoxCellRow(gridSize, box, boxCell);
        const column = GridSizeUtility.getGridBoxCellColumn(gridSize, box, boxCell);
        
        return new GridLocation(row, column);
    }
}