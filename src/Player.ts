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
        
        //kind of edge case, but need to handle the case of pressing both buttons
        private moveType:MoveType;

        constructor(startX,startY){
            this.velocity = new Vector(0,0);
            this.width = 1 * 32;
            this.height = 2 * 32;
            this.color = [0,0,0];
            this.moveType = MoveType.NONE;

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
            //update the velocity based on the input
            var xVel = this.velocity.x;
            switch(this.moveType){
                case MoveType.LEFT:
                case MoveType.BOTH_LEFT:
//                    console.log("moving left");
                    xVel -= 16;
                    if(xVel < -600) xVel = -600;
                    break;
                case MoveType.RIGHT:
                case MoveType.BOTH_RIGHT:
//                    console.log("moving right");
                    xVel += 15;
                    if(xVel > 600) xVel = 600;
                    break;
                default:
//                    console.log("moving right");
                    xVel = 0;
                    break;
                    
            }
            var perSec = elapsedTime/1000;
            var gravity = 1500 * perSec;
            var yVel = this.velocity.y - gravity;
            if(yVel < -600){
                //terminal velocity
                yVel = -600;
            }
            this.velocity.y = yVel;
//            console.log("velocity",this.velocity);
            this.velocity.x = xVel;
            var moveVector = this.velocity.timesNum(perSec);
            this.position = this.position.plus(moveVector);
            
            //temp collision detection  
            if(this.position.y < 160){//160 baseline
                var diffOver = 160 - this.position.y;
                //correct the move
                moveVector.y += diffOver;
                this.position.y = 160;
                this.velocity.y = 0;
            }
            this.bounds.moveXY(moveVector);
        }

        onInput(inputEvent:InputEventType){
            switch(inputEvent){
                case InputEventType.MOVE_LEFT_START:
                    if(this.moveType == MoveType.NONE || this.moveType == MoveType.LEFT){
                        this.moveType = MoveType.LEFT;
                    }else{
                        this.moveType = MoveType.BOTH_LEFT;
                    }
                    break;
                case InputEventType.MOVE_LEFT_END:
                    if(this.moveType == MoveType.LEFT || this.moveType == MoveType.NONE){
                        this.moveType = MoveType.NONE;
                    }else{
                        this.moveType = MoveType.RIGHT;
                    }
                    break;
                
                case InputEventType.MOVE_RIGHT_START:
                    if(this.moveType == MoveType.NONE || this.moveType == MoveType.RIGHT){
                        this.moveType = MoveType.RIGHT;
                    }else{
                        this.moveType = MoveType.BOTH_RIGHT;
                    }
                    break;
                case InputEventType.MOVE_RIGHT_END:
                    if(this.moveType == MoveType.RIGHT || this.moveType == MoveType.NONE){
                        this.moveType = MoveType.NONE;
                    }else{
                        this.moveType = MoveType.LEFT;
                    }
                    break;
                case InputEventType.JUMP_START:
                    if(this.velocity.y == 0){
                        this.velocity.y = 800;
                    }
                    break;
            }
        }

        private initPosition(x,y){
            this.position = new Vector(x,y);
            var bl = new Vector(x-(this.width/2),y-(this.height/2));
            var tr = new Vector(bl.x+this.width,bl.y+this.height);
            this.bounds = new Bounds(bl,tr);
            this.tileLocation = {col:0,row:0};
        }
    }

    enum MoveType{NONE,LEFT,RIGHT,BOTH_LEFT,BOTH_RIGHT}
}