import { BoxLocation } from './BoxLocation';
import { GridLocation } from './GridLocation';
import { GridSize } from './GridSize';

/**
 * BoxLocation factory methods.
 */
export class BoxLocationFactory {
    private constructor() { }
    
    /**
     * Creates a BoxLocation using a GridLocation.
     * @param {GridLocation} location - The grid location.
     * @param {GridSize} gridSize - The grid size.
     * @return {BoxLocation} A BoxLocation object.
     */
    public static create(location: GridLocation, gridSize: GridSize): BoxLocation {
        throw 'No implemented';
    }
}