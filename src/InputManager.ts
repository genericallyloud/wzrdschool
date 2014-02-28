///<reference path="GameEngine.ts"/>
module WZRD {
    export class InputManager {
        private gameEngine:GameEngine;
        private _onkeydown;
        private _onkeyup;
        
        constructor(gameEngine){
            this.gameEngine = gameEngine;

            //callbacks bound to this for easier registering
            this._onkeydown = (event)=>this.keydown(event);
            this._onkeyup = (event)=>this.keyup(event);
        }
    
        start() {
            document.addEventListener("keydown",this._onkeydown);
            document.addEventListener("keyup",this._onkeyup);
        }
        pause(){
            document.removeEventListener("keydown",this._onkeydown);
            document.removeEventListener("keyup",this._onkeyup);
        }
        keydown(e) {
            if (e.keyCode == '37') {
                // left arrow
            }
            else if (e.keyCode == '39') {
                // right arrow
            }
            e.preventDefault();
        }
        keyup(e) {
            //handle key up
            e.preventDefault();
        }
    }
}