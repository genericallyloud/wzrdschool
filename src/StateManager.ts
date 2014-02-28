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
    }
}