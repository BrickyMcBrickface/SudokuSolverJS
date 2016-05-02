import { BoxSize } from './BoxSize';

export class GridSize {
    private readonly _boxSize: BoxSize;
    
    public constructor(boxSize: BoxSize) {
        this._boxSize = boxSize;
    }
    
    public get boxSize(): BoxSize {
        return this._boxSize;
    }
    
    public get size(): number {
        return this.boxSize.width * this.boxSize.height;
    }
    
    public get cellCount(): number {
        return this.size * this.size;
    }
    
    public get bandSize(): number {
        return this.boxSize.height;
    }
    
    public get stackSize(): number {
        return this.boxSize.width;
    }
    
    public static readonly Default: GridSize = new GridSize(BoxSize.Default);
}