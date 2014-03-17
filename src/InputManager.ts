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
            if (e.keyCode == '65') { //a
                this.gameEngine.fireInputEvent(InputEventType.MOVE_LEFT_START);
                
            }else if (e.keyCode == '68') { //d
                this.gameEngine.fireInputEvent(InputEventType.MOVE_RIGHT_START);
                
            }else if (e.keyCode == '32') { //space
                this.gameEngine.fireInputEvent(InputEventType.JUMP_START);
                
            }else if (e.keyCode == '83') { //s
                this.gameEngine.fireInputEvent(InputEventType.DUCK_START);
                
            }else if (e.keyCode == '27') { //escape
                this.gameEngine.fireInputEvent(InputEventType.PAUSE);
            }
            e.preventDefault();
        }
        keyup(e) {
            if (e.keyCode == '65') { //a
                this.gameEngine.fireInputEvent(InputEventType.MOVE_LEFT_END);
                
            }else if (e.keyCode == '68') { //d
                this.gameEngine.fireInputEvent(InputEventType.MOVE_RIGHT_END);
                
            }else if (e.keyCode == '32') { //space
                this.gameEngine.fireInputEvent(InputEventType.JUMP_END);
                
            }else if (e.keyCode == '83') { //s
                this.gameEngine.fireInputEvent(InputEventType.DUCK_END);
            }
            e.preventDefault();
        }
    }

    export enum InputEventType {
        MOVE_LEFT_START, MOVE_LEFT_END,
        MOVE_RIGHT_START, MOVE_RIGHT_END,
        JUMP_START, JUMP_END,
        DUCK_START, DUCK_END,
        PAUSE
    }
}