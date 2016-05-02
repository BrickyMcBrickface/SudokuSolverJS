export class GridLocation {
    private readonly _row: number;
    private readonly _column: number;
    
    public constructor(row: number, column: number) {
        if(row <= 0) throw 'Row is invalid.';
        if(column <= 0) throw 'Column is invalid';
        
        this._row = row;
        this._column = column;
    }
    
    public get row(): number {
        return this._row;
    }
    
    public get column(): number {
        return this._column;
    }
}