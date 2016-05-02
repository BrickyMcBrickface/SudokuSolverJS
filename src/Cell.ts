import { GridLocation } from './GridLocation';

export class Cell {
    private readonly _location: GridLocation;
    private readonly _value: number;
    
    public constructor(location: GridLocation, value: number) {
        if(value < 0) throw 'Cell value is invalid';
        
        this._location = location;
        this._value = value;
    }
    
    public get location(): GridLocation {
        return this._location;
    }
    
    public get value(): number {
        return this._value;
    }
    
    public isEmpty = () => this.value === 0;
}