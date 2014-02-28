///<reference path="Vector.ts"/>
module WZRD {
    export class Bounds {
        private bottomLeft:Vector;
        private topRight:Vector;

        constructor(bottomLeft:Vector, topRight:Vector){
            this.bottomLeft = bottomLeft;
            this.topRight = topRight;
        }

        getBottom(){
            return this.bottomLeft.y;
        }

        getTop(){
            return this.topRight.y;
        }

        getRight(){
            return this.topRight.x;
        }

        getLeft(){
            return this.bottomLeft.x;
        }

        intersectsWith(other:Bounds){

        }

        insideXOf(other:Bounds){
            if(this.bottomLeft.x < other.bottomLeft.x) return this.bottomLeft.x - other.bottomLeft.x;
            if(this.topRight.x > other.topRight.x) return this.topRight.x - other.topRight.x;
            return 0;
        }

        insideYOf(other:Bounds){
            if(this.bottomLeft.y < other.bottomLeft.y) return this.bottomLeft.y - other.bottomLeft.y;
            if(this.topRight.y > other.topRight.y) return this.topRight.y - other.topRight.y;
            return 0;
        }

        moveX(x){
            this.bottomLeft.x+=x;
            this.topRight.x+=x;
        }

        moveY(y){
            this.bottomLeft.y+=y;
            this.topRight.y+=y;
        }

        moveXY(moveVector){
            this.bottomLeft = this.bottomLeft.plus(moveVector);
            this.topRight = this.topRight.plus(moveVector);
        }

        getEdge(edge:Edge):number{
            if(edge == Edge.LEFT){
                return this.getLeft();
            }else if(edge == Edge.RIGHT){
                return this.getRight();
            }else if(edge == Edge.TOP){
                return this.getTop();
            }else{
                return this.getBottom();
            }
        }
    }

    export enum Edge {
        LEFT,
        RIGHT,
        TOP,
        BOTTOM
    }
}