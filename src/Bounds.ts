///<reference path="Vector.ts"/>
module WZRD {
    /**
     * This class is basically just  rectangle with some methods for determining intersection
     */
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
    
        /**
         * The function operates expecting this bounds to be moving right,
         * and testing to see if it intersects with the left edge of other
         */
        intersectsLeft(other:Bounds):number{
            if(this.getRight() > other.getLeft() && this.getLeft() < other.getLeft()){
                return other.getLeft() - this.getRight();
            }else{
                return 0;
            }
        }
    
        /**
         * True if intersects with the right edge of other
         */
        intersectsRight(other:Bounds):number{
            return other.intersectsLeft(this) * -1;
        }
    
        /**
         * True if intersects with the top edge of other
         */
        intersectsTop(other:Bounds):number{
            if(this.getBottom() < other.getTop() && this.getTop() > other.getTop()){
                return other.getTop() - this.getBottom();
            }else{
                return 0;
            }
        }
    
        /**
         * True if intersects with the bottom edge of other
         */
        intersectsBottom(other:Bounds):number{
            return other.intersectsTop(this) * -1;
        }

        /**
         * Tests if this bounds is wholely contained within the other bounds on the x axis and if not,
         * returns the amount out of bounds it is
         */
        insideXOf(other:Bounds){
            if(this.bottomLeft.x < other.bottomLeft.x) return this.bottomLeft.x - other.bottomLeft.x;
            if(this.topRight.x > other.topRight.x) return this.topRight.x - other.topRight.x;
            return 0;
        }

        /**
         * Tests if this bounds is wholely contained within the other bounds on the x axis and if not,
         * returns the amount out of bounds it is
         */
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
    
        copy():Bounds{
            return new Bounds(this.bottomLeft.copy(),this.topRight.copy());
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
    
        getOppositeEdge(edge:Edge):number{
            return this.getEdge(toOppositeEdge(edge));
        }
    
        static fromEdgesBLTR(bottom, left, top, right):Bounds{
            return new Bounds(new Vector(left,bottom), new Vector(right,top));
        }
        static fromEdgesObject(edges:{left:number;bottom:number;right:number;top:number;}):Bounds{
            return new Bounds(new Vector(edges.left,edges.bottom), new Vector(edges.right,edges.top));
        }
    }

    export enum Edge {
        LEFT,
        RIGHT,
        TOP,
        BOTTOM
    }

    export function toOppositeEdge(edge:Edge):Edge{
        switch(edge){
            case Edge.LEFT:
                return Edge.RIGHT;
            case Edge.RIGHT:
                return Edge.LEFT;
            case Edge.TOP:
                return Edge.BOTTOM;
            case Edge.BOTTOM:
                return Edge.TOP;
        }
    }
}