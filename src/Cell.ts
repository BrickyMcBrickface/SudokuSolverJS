import { GridLocation } from './GridLocation';

/**
 * Represents a cell on the grid.
 */
export class Cell {
    private readonly _location: GridLocation;
    private readonly _value: number;
    
    /**
     * Creates a new Cell object.
     * @constructor
     * @param {GridLocation} location - The grid location of the cell.
     * @param {number} value - The value of the cell.
     */
    public constructor(location: GridLocation, value: number) {
        if(value < 0) throw 'Cell value is invalid';
        
        this._location = location;
        this._value = value;
    }
    
    /**
     * Gets the grid location of the cell.
     * @return {GridLocation} The cell's grid location.
     */
    public get location(): GridLocation {
        return this._location;
    }
    
    /**
     * Gets the value of the cell.
     * @return {number} The cell's value.
     */
    public get value(): number {
        return this._value;
    }
    
    /**
     * Checks if the cell is empty or not.
     * @return {boolean} True if the cell is empty; False otherwise.
     */
    public isEmpty = () => this.value === 0;
}