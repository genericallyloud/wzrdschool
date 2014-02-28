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

        constructor(startX,startY){
            this.velocity = new Vector(0,0);
            this.width = 1;
            this.height = 1.8;

            this.initPosition(startX,startY);
        }

        writeToBuffer(buffer){

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