///<reference path="Vector.ts"/>
///<reference path="Bounds.ts"/>
///<reference path="underscore.d.ts"/>
module WZRD {
    export interface CollisionTile {
        isSlope():boolean;
        getSlopeY(x:number):number;
        getSide(collisionSide:Edge):number;
        isCollision(edge:Edge):boolean;
        anyCollision():boolean;
    }
    
    class EmptyTile implements CollisionTile {
        isSlope():boolean{
            return false;
        }
        getSlopeY(x:number):number{
            return 0;
        }
        getSide(collisionSide:Edge):number{
            return 0;
        }
        isCollision(edge:Edge):boolean{
            return false;
        }
        anyCollision():boolean{
            return false;
        }
    }
    
    export var EMPTY_TILE:CollisionTile = new EmptyTile();
    
    export class BlockTile implements CollisionTile {
        private tileDef:TileDef;
        private col:number;
        private row:number;
        private tileSize:number;
        
        constructor(tileDef:TileDef, col:number, row:number, tileSize:number){
            if(!tileDef){
                debugger;
                console.log("no tiledef - wtf");
            }
            this.tileDef = tileDef;
            this.col = col;
            this.row = row;
            this.tileSize = tileSize;
        }
        isSlope():boolean{
            return this.tileDef.tileCollisionType === TileCollisionType.SLOPE;
        }
        getSlopeY(x:number):number{
            return this.tileDef.slope(x);
        }
        getSide(collisionSide:Edge):number{
            switch(this.tileDef.tileCollisionType){
                case TileCollisionType.NONE:
                case TileCollisionType.SLOPE:
                    return 0;
                case TileCollisionType.BLOCK:
                case TileCollisionType.EDGE:
                    return tileEdgeToPx(this.col,this.row,collisionSide,this.tileSize);
            }
        }
        isCollision(edge:Edge):boolean{
            switch(this.tileDef.tileCollisionType){
                case TileCollisionType.NONE:
                    return false;
                case TileCollisionType.BLOCK:
                    return true;
                case TileCollisionType.SLOPE:
                    return edge == Edge.TOP || edge == Edge.BOTTOM;
                case TileCollisionType.EDGE:
                    return _.contains(this.tileDef.sides,edge);
            }
        }
        anyCollision():boolean{
            return this.tileDef.tileCollisionType != TileCollisionType.NONE;
        }
    }
    
    export function tileEdgeToPx(col:number, row:number, edge:Edge, tileSize:number){
        switch(edge){
            case Edge.TOP:
                return (row + 1)*tileSize - 1;
            case Edge.BOTTOM:
                return row * tileSize;
            case Edge.LEFT:
                return col * tileSize;
            case Edge.RIGHT:
                return (col + 1)*tileSize - 1;
        }
    }
    
    export interface TileDef {
        tileCollisionType:TileCollisionType;
        slope?:(number)=>number;
        sides?:Edge[];
    }
    
    export enum TileCollisionType{
        NONE,
        BLOCK,
        SLOPE,
        EDGE
    }
}