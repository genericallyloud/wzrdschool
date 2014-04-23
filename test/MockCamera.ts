///<reference path="../src/Vector.ts"/>
module WZRD {
    export class MockCamera {

        constructor(player){}

        update(elapsedTime:number){}

        /**
         * This is the translation passed to the shader to adjust the vertices to center the camera
         * @returns {Vector}
         */
        getCameraTranslation():Vector{
            return new Vector(0,0);
        }

        /**
         * using the width and knowing the translation, should be able to figure out the column range with a bit of extra
         */
        getColumnStartWidth(){
            return {start:0,width:30};
        }

        /**
         * This will typically be called by the RenderManager, because that is what controls the
         * canvas tag and watches for changes to size
         *
         * @param width
         * @param height
         */
        onResize(width:number,height:number){}

        onLevelChange(maxTileCol:number){}
    }
}