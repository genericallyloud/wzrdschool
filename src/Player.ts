///<reference path="Vector.ts"/>
///<reference path="Bounds.ts"/>
module WZRD {
    export class Player {
        private position:Vector;
        private velocity:Vector;
        private tileLocation;
        public bounds:Bounds;
        private width:number;
        private height:number;
        private color:number[];

        constructor(startX,startY){
            this.velocity = new Vector(0,0);
            this.width = 1 * 32;
            this.height = 1.8 * 32;
            this.color = [0,0,0];

            this.initPosition(startX,startY);
        }

        writeToBuffer(buffer:Float32Array, bufferIndex:number):number{
            var bottom = this.bounds.getBottom(),
            top = this.bounds.getTop(),
            left = this.bounds.getLeft(),
            right = this.bounds.getRight(),
            color = this.color; //TODO change to sprite texture

            // FIRST TRIANGLE

            //bottom left
            bufferIndex = TileEngine.createTileVertex(left,bottom,color,buffer,bufferIndex);
            //bottom right
            bufferIndex = TileEngine.createTileVertex(right,bottom,color,buffer,bufferIndex);
            //top left
            bufferIndex = TileEngine.createTileVertex(left,top,color,buffer,bufferIndex);

            //SECOND TRIANGLE

            //top left
            bufferIndex = TileEngine.createTileVertex(left,top,color,buffer,bufferIndex);
            //bottom right
            bufferIndex = TileEngine.createTileVertex(right,bottom,color,buffer,bufferIndex);
            //top right
            bufferIndex = TileEngine.createTileVertex(right,top,color,buffer,bufferIndex);

            return bufferIndex;
        }

        update(elapsedTime:number){
            var moveVector = this.velocity.timesNum(elapsedTime);
            this.position = this.position.plus(moveVector);
            this.bounds.moveXY(moveVector);
        }

        private initPosition(x,y){
            this.position = new Vector(x,y);
            var bl = new Vector(x-(this.width/2),y-(this.height/2));
            var tr = new Vector(bl.x+this.width,bl.y+this.height);
            this.bounds = new Bounds(bl,tr);
            this.tileLocation = {col:0,row:0};
        }
    }
}