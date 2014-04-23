///<reference path="Vector.ts"/>
///<reference path="Bounds.ts"/>
///<reference path="CollisionTile.ts"/>
///<reference path="TileEngine.ts"/>
///<reference path="underscore.d.ts"/>
module WZRD {
    export class SpriteTileCollisionResolver {
        private bounds:Bounds;
        private move:Vector;
        private tiles:CollisionTile[][];
        private xEdge:number;
        private xPreEdge:number;
        private yEdge:number;
        private yPreEdge:number;
        private width:number;
        private height:number;
        private xCollisionSide:Edge;
        private yCollisionSide:Edge;
        
        private leftCollisionTile:TileDef;
        private rightCollisionTile:TileDef;
        private bottomCollisionTile:TileDef;
        private topCollisionTile:TileDef;
        
        //this will be set by the end of construction
        private adjustment:Vector;

        constructor(bounds:Bounds,move:Vector,tiles:CollisionTile[][]){
            //setup all the variables we'll need for collision resolution
            this.bounds = bounds;
            this.move = move;
            this.tiles = tiles;
            
            this.width = tiles.length;
            this.height = tiles[0].length;
        
            //the edges and pre-edges variables are used to genericize the access
            //to the tile 2d array so that the collision algorithms can be
            //independent of the movement direction
            //imagine the collision 2d array as a grid of all tiles that the sprite overlaps
            //edges are the sides of the box that the sprite is moving into
            //and pre-edges are the rows/cols right next to the sides
            if(move.x > 0){
                //moving right, get the right edge
                this.xEdge = this.width - 1;
                this.xPreEdge = this.xEdge - 1;
                this.xCollisionSide = Edge.LEFT;
            }else{
                this.xEdge = 0;
                this.xPreEdge = 1;
                this.xCollisionSide = Edge.RIGHT;
            }
    
            if(move.y > 0){
                this.yEdge = this.height - 1;
                this.yPreEdge = this.yEdge - 1;
                this.yCollisionSide = Edge.BOTTOM;
            }else{
                this.yEdge = 0;
                this.yPreEdge = 1;
                this.yCollisionSide = Edge.TOP;
            }
    
            //the collision algorithm operates off of a few case
            
            //the first case to test is for a single corner collision
            var isSingleCorner = this.adjustSingleCorner();
            if(!isSingleCorner){
                //if not single corner,  do the x axis adjustment first before y
                var xAdjust = this.adjustX();
                //finally, perform y adjustment
                var yAdjust = this.adjustY();
                this.adjustment = new Vector(xAdjust, yAdjust);
            }
            
        }

        getAdjustment():Vector{
            return this.adjustment;
        }
    
        /**
         * this is a very specialized but important case. if only one corner of the whole grid is a possible
         * collision, then I need to do some specialized handling of whether or not the collision
         * happens along the x axis (side) or y axis (top or bottom)
         */
        private adjustSingleCorner():boolean {
            var cornerTile = this.tiles[this.xEdge][this.yEdge];
            //if it is a collision in both directions, then we might need to deal with the special rules
            if(cornerTile.isCollision(this.xCollisionSide) && cornerTile.isCollision(this.yCollisionSide)){
                //loop the x/y edges to see if this is the only one
                var xCount = _.filter(this.tiles[this.xEdge], (tile:CollisionTile) => tile.isCollision(this.xCollisionSide)).length;
                var yCount = _.filter(this.tiles, col => col[this.yEdge].isCollision(this.yCollisionSide)).length;
                if(xCount == 1 && yCount == 1){
                    var xCollision = this.isCollisionOnX(cornerTile),
                        overlapEdge,
                        correction;
                    if(xCollision){
                        overlapEdge = this.bounds.getOppositeEdge(this.xCollisionSide);
                        correction = cornerTile.getSide(this.xCollisionSide) - overlapEdge;
                        correction += correction > 0?1:-1;
                        this.adjustment = new Vector(correction,0);
                    }else{
                        overlapEdge = this.bounds.getOppositeEdge(this.yCollisionSide);
                        correction = cornerTile.getSide(this.yCollisionSide) - overlapEdge;
                        correction += correction > 0?1:-1;
                        this.adjustment = new Vector(0, correction);
                    }
                    return true;
                }
            }
            return false;
        }
        
        /**
         * Based on the single corner case. Uses the slope of movement combined with collision
         * and position to determine what edge the movement went through of the tile.
         *
         * returns true if the collision intersection goes through x axis
         */
        private isCollisionOnX(cornerTile:CollisionTile):boolean {
            //ok, we've isolated it down to just the single corner case. This requires us to know
            //the actual edge which we went through, which means getting the leading corner of the bounds
            var boundsCorner = new Vector(this.bounds.getOppositeEdge(this.xCollisionSide),         
                                          this.bounds.getOppositeEdge(this.yCollisionSide));
            //so, to determine whether the collision was with the x edge or the y edge, we basically need
            //to apply a simple slope equation to find out if it would cross the x edge of the tile first or the
            //y edge, so first, we need to determine the linear equation
            var slope = this.move.y/this.move.x;
            var yIntercept = boundsCorner.y - (slope * boundsCorner.x);
            
            //now determine where the point would cross the boundary of the tile
            var tileX = cornerTile.getSide(this.xCollisionSide);
            var intersectY = slope * tileX + yIntercept;
            var tileY = cornerTile.getSide(this.yCollisionSide);
            
            if(this.yCollisionSide == Edge.BOTTOM){
                //going up, as long as intersect is above the tile's y edge, its hitting from the side
                return intersectY >= tileY;
            }else{
                //if going down, intersect must be lower than the tile's y edge to be a hit from side
                return intersectY <= tileY;
            }
        }

        /**
         * Determines the amount of adjustment needed along the x axis.
         */
        private adjustX():number{
            var allX:number[] = _.chain(_.zip(this.tiles[this.xEdge],this.tiles[this.xPreEdge]))
                        //only include the values from any tiles that *are* a collision, but do not
                        //have collision on the pre-edge tile
                        .filter(tPair => tPair[0].anyCollision() && (!tPair[1].anyCollision()))
                        .map(tPair => tPair[0].getSide(this.xCollisionSide)).value();
            if(allX.length == 0){
                //no adjustment
                return 0;
            }else if(this.xCollisionSide == Edge.RIGHT){
                //moving left, correction should be positive
                return _.max(allX) + 1 - this.bounds.getLeft();
            }else{
                //moving right, correction should be negative
                return _.min(allX) - 1 - this.bounds.getRight();
            }
        }

        /**
         * Determines the amount of adjustment needed along the y axis
         */
        private adjustY():number{
            var midPoint = (this.bounds.getLeft() + this.bounds.getRight())/2;//midpoint of sprite
            //now using the absolute midpoint in pixels, need to find which column that is
            var midPointTile = TileEngine.pixelToTile(midPoint);
            var midPointOffset = midPointTile - TileEngine.pixelToTile(this.bounds.getLeft());
            var slopeTile = this.tiles[midPointOffset][this.yPreEdge]
            var anySlopes = _.any(yPairs, yp => yp[0].isSlope() || yp[1].isSlope());
            if(anySlopes){
                //slopes are handled by saying that they do not slow down movement in the x direction, but have
                //a variable y adjustment based on the x passed in (which is the midpoint)
                return slopeTile.getSlopeY(this.adjustment.x);
            }else{
                var yPairs = _.zip(this.getYEdgeArray(this.yEdge),this.getYEdgeArray(this.yPreEdge));
                var allY:number[] = _.chain(yPairs)
                        //only include the values from any tiles that *are* a collision, but do not
                        //have collision on the pre-edge tile
                        .filter(tPair => tPair[0].anyCollision() && (!tPair[1].anyCollision()))
                        .map(tPair => tPair[0].getSide(this.yCollisionSide)).value();//then get the value of the collision edge
                if(allY.length == 0){
                    //no adjustment
                    return 0;
                }else if(this.yCollisionSide == Edge.TOP){
                    //moving down, correction should be positve
                    return _.max(allY) + 1 - this.bounds.getBottom();
                }else{
                    //moving up, correction should be negative
                    return _.min(allY) - 1 - this.bounds.getTop();
                }
            }
            return 5;
        }

        /**
         * Just a simple helper method
         */
        private getYEdgeArray(y:number):CollisionTile[]{
            return this.tiles.map(col => col[y]);
        }
    }
}