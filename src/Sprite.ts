///<reference path="Vector.ts"/>
///<reference path="Bounds.ts"/>
module WZRD {
    export interface Sprite {
        bounds:Bounds;
        velocity:Vector;
        update(elapsedTime:number);
        writeToBuffer(buffer:Float32Array, bufferIndex:number):number;
        collide(edge:Edge);
    }
}