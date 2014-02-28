///<reference path="GameEngine.ts"/>
module WZRD {

    export class WzrdSchool {
        private engine ;

        constructor(){
            this.engine = new GameEngine();
        }

        start(){
            this.engine.start();
        }
    }

    export function main(){
        new WzrdSchool().start();
    }
}