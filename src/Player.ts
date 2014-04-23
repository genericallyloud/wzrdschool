///<reference path="Vector.ts"/>
///<reference path="Bounds.ts"/>
///<reference path="Sprite.ts"/>
///<reference path="InputManager.ts"/>
module WZRD {
    export class Player implements Sprite{
        public velocity:Vector;
        private tileLocation;
        public bounds:Bounds;
        private width:number;
        private height:number;
        private color:number[];
        private onGround:boolean;
        
        //kind of edge case, but need to handle the case of pressing both buttons
        private moveType:MoveType;

        constructor(startX,startY){
            this.velocity = new Vector(0,0);
            this.width = 1 * 32;
            this.height = 2 * 32;
            this.color = [0,0,0];
            this.moveType = MoveType.NONE;
            this.onGround = true;

            this.initPosition(startX,startY);
        }

        /**
         * This is basically the draw function
         */
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

        /**
         * Called on every frame. Updates the player location which will be needed to
         * update the camera etc.
         */
        update(elapsedTime:number){
            //update the velocity based on the input
            var xVel = this.velocity.x;
            
            //based on the movement type, we adjust our speed
            switch(this.moveType){
                //any left movement accelerates left direction until top speed
                case MoveType.LEFT:
                case MoveType.BOTH_LEFT:
                    if(xVel > 0) xVel = 0;
                    xVel -= 25;
                    if(xVel < -600) xVel = -600;
                    break;
                //any right movement accelerates right until top speed
                case MoveType.RIGHT:
                case MoveType.BOTH_RIGHT:
                    if(xVel < 0) xVel = 0;
                    xVel += 25;
                    if(xVel > 600) xVel = 600;
                    break;
                //if not moving, quickly slow down until stop
                default:
                    if(xVel < -50){
                        xVel += 50;
                    }else if(xVel > 50){
                        xVel -= 50;
                    }else{
                        xVel = 0;
                    }
                    break;
                    
            }
            //assume all of our velocities are based on per second rates (px/s)
            var perSec = elapsedTime/1000;
            console.log(perSec);
            var gravity = 1400 * perSec; // -1500 px/s^2
            var yVel = this.velocity.y - gravity;
            if(yVel < -500){
                //terminal velocity
                yVel = -500;
            }
            this.velocity.y = yVel;
            this.velocity.x = xVel;
            //take the velocity and multiply times time to get distance
            var moveVector = this.velocity.timesNum(perSec);
            //now adjust the bounds box with the move vector
            this.bounds.moveXY(moveVector);
            if(yVel < 0){
                //I'm falling
                this.onGround = false;
                //this will get reset by collision detection if corrected
            }
        }

        /**
         * This is called any time there is input that a player should be aware of to adjust itself
         */
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
                    if(this.onGround){
                        this.onGround = false;
                        //a high initial velocity going up
                        this.velocity.y = 700;
                    }
                    break;
            }
        }
        
        collide(edge:Edge){
            if(edge == Edge.BOTTOM){
                this.onGround = true;
            }
        }

        private initPosition(x,y){
            var bl = new Vector(x-(this.width/2),y-(this.height/2));
            var tr = new Vector(bl.x+this.width,bl.y+this.height);
            this.bounds = new Bounds(bl,tr);
            this.tileLocation = {col:0,row:0};
        }
    }

    /**
     * The move types are slightly convoluted, but need to handle the case of
     * pressing both keys and lifting one up again gracefully. This basically creates
     * a state machine handled in the onInput method
     */
    enum MoveType{NONE,LEFT,RIGHT,BOTH_LEFT,BOTH_RIGHT}
}