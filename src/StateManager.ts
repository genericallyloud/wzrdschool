///<reference path="Sprite.ts"/>
///<reference path="Player.ts"/>
///<reference path="TileEngine.ts"/>
module WZRD {
    export class StateManager {
        private tileEngine:TileEngine;
        private player:Player;

        constructor(tileEngine, player){
            this.tileEngine = tileEngine;
            this.player = player;
        }

        update(elapsedTime:number){
            this.player.update(elapsedTime);
        }
    
        getActiveSprites():Sprite[]{
            return [this.player];
        }
    
        getSpriteVertices(){
            var spriteCount = 1;
            var vertexCount = spriteCount * 6;
            var buffer = new Float32Array(vertexCount * 5),//each vertex has 5 floats
                bufferIndex = 0;
            this.player.writeToBuffer(buffer, bufferIndex);
            //in the future, we'll want to go through the list of all 
            return {buffer:buffer, vertexCount:vertexCount};
        }
    }
}