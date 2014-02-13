var WZRD = (function(WZRD){
    "use strict";
    
    function InputManager(gameEngine){
        this.gameEngine = gameEngine;
        
        //callbacks bound to this for easier registering
        this._onkeydown = function(event){
            this.keydown(event);
        }.bind(this);
        this._onkeyup = function(event){
            this.keyup(event);
        }.bind(this);
        
    }
    
    InputManager.prototype.start = function start() {
        document.addEventListener("keydown",this._onkeydown);
        document.addEventListener("keyup",this._onkeyup);
    };
    
    InputManager.prototype.pause = function(){
        document.removeEventListener("keydown",this._onkeydown);
        document.removeEventListener("keyup",this._onkeyup);
    };
    
    InputManager.prototype.keydown = function keydown(e) {
        if (e.keyCode == '37') {
            // left arrow
            gameState.xDiff = -10;
        }
        else if (e.keyCode == '39') {
            // right arrow
            gameState.xDiff = 10;
        }
        e.preventDefault();
    };
    InputManager.prototype.keyup = function keyup(e) {
        gameState.xDiff = 0;
        e.preventDefault();
    };
                                  
    
    WZRD.InputManager = InputManager;
}(WZRD || {}));