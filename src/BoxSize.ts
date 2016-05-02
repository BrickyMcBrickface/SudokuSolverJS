export class BoxSize {
    private readonly _width: number;
    private readonly _height: number;
    
    public constructor(width: number, height: number) {
        if(width <= 0) throw 'Box size width is invalid.';
        if(height <= 0) throw 'Box size height is invalid.';
        
        this._width = width;
        this._height = height;
    }
    
    public get width(): number {
        return this._width;
    }
    
    public get height(): number {
        return this._height;
    }
    
    public get cellCount(): number {
        return this.width * this.height;
    }
    
    public static readonly Default: BoxSize = new BoxSize(3, 3);
}