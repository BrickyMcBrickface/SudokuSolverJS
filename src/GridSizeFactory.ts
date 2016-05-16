import { GridSize } from './GridSize';
import { BoxSize } from './BoxSize';

/**
 * GridSize factory methods.
 */
export class GridSizeFactory {
    private constructor() { }
    
    /**
     * Creates a new GridSize object using box dimensions.
     * @param {number} boxWidth - The box width.
     * @param {number} boxHeight - The box height.
     * @return {GridSize} A GridSize object.
     */
    public static create(boxWidth: number, boxHeight: number): GridSize {
        return new GridSize(new BoxSize(boxWidth, boxHeight));
    }
}