/**
 * Represents a location on the Grid.
 */
export class GridLocation {
    private readonly _row: number;
    private readonly _column: number;
    
    /**
     * Creates a new GridLocation object.
     * @constructor
     * @param {number} row - The row number.
     * @param {number} column - The column number.
     */
    public constructor(row: number, column: number) {
        if(row <= 0) throw 'Row is invalid.';
        if(column <= 0) throw 'Column is invalid';
        
        this._row = row;
        this._column = column;
    }
    
    /**
     * Gets the row number.
     * @return {number} The row number.
     */
    public get row(): number {
        return this._row;
    }
    
    /**
     * Gets the column number.
     * @return {number} The column number.
     */
    public get column(): number {
        return this._column;
    }
}