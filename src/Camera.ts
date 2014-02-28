///<reference path="Player.ts"/>
///<reference path="Vector.ts"/>
///<reference path="Bounds.ts"/>
module WZRD {
    export class Camera {
        private player:Player;
        private cameraStyle:CameraStyle;
        private trackingWindowBounds:Bounds;

        private centerXAdjust:number;
        private centerYAdjust:number;
        private canvasWidth:number;
        private maxTileCol:number;
        private maxTargetX:number;

        //this is the bottom left edge in pixels
        private cameraTranslation:Vector;
        private leadingEdge:Edge;

        constructor(player){
            this.player = player;
            var right = player.bounds.getRight();
            var bottom = player.bounds.getBottom();
            this.trackingWindowBounds = new Bounds(
                    new Vector(right-Camera.TRACKING_WIDTH,bottom),
                    new Vector(right, bottom+Camera.TRACKING_HEIGHT));
            this.cameraStyle = CameraStyle.GROUND_LOCK;
            this.leadingEdge = Edge.RIGHT;
        }

        update(elapsedTime:number){
            this.updateX(elapsedTime);

        }

        /**
         * This will update the x field of the
         * @param elapsedTime
         */
        private updateX(elapsedTime:number){
            //check bounds of player vs tracking
            var diff = this.player.bounds.insideXOf(this.trackingWindowBounds);
            //if within horizontal bounds, don't update camera
            if(diff == 0) return;

            //if outside bounds, adjust tracking to leading edge
            this.trackingWindowBounds.moveX(diff);
            if(diff < 0){
                this.leadingEdge = Edge.LEFT;
            }else{
                this.leadingEdge = Edge.RIGHT;
            }

            //if adjustment needed, adjust camera to center camera on leading edge of tracking window
            var targetXCenter = this.trackingWindowBounds.getEdge(this.leadingEdge);
            //camera adjustment has a maximum speed to prevent jerky camera
            var currCenter = this.cameraTranslation.x + this.centerXAdjust;
            if(targetXCenter == currCenter) return;

            var maxDistance = (elapsedTime/1000) * Camera.MAX_MOVE_RATE;
            if(targetXCenter > currCenter){
                //moving camera to the right
                if(targetXCenter-currCenter > maxDistance){
                    targetXCenter = currCenter+maxDistance;
                }
            }else{
                //moving camera to the left
                if(currCenter-targetXCenter > maxDistance){
                    targetXCenter = currCenter-maxDistance;
                }
            }

            //now we need to handle whether or not we've hit our max range

            this.cameraTranslation.x = targetXCenter - this.centerXAdjust;
        }

        /**
         * This is the translation passed to the shader to adjust the vertices to center the camera
         * @returns {Vector}
         */
        getCameraTranslation():Vector{
            return this.cameraTranslation;
        }

        /**
         * using the width and knowing the translation, should be able to figure out the column range with a bit of extra
         */
        getColumnStartWidth(){
            var colStart = ((this.cameraTranslation.x/32)|0)-1;
            var colWidth = ((this.canvasWidth/32)|0)+2;
            return {start:colStart,width:colWidth};
        }

        /**
         * This will typically be called by the RenderManager, because that is what controls the
         * canvas tag and watches for changes to size
         *
         * @param width
         * @param height
         */
        onResize(width:number,height:number){
            this.centerXAdjust = width/2;
            this.centerYAdjust = height/2;
            this.canvasWidth = width;

            this.maxTargetX = (this.maxTileCol * 32)-this.centerXAdjust;
        }

        onLevelChange(maxTileCol:number){
            this.maxTileCol = maxTileCol;
        }

        static TRACKING_WIDTH = 64;
        static TRACKING_HEIGHT = 128;
        static MAX_MOVE_RATE = (10 * 32);//10 tiles per second
    }

    export enum CameraStyle {
        GROUND_LOCK,
        PLATFORM_LOCK,
        CEILING_LOCK,
        UNLOCKED
    }
}