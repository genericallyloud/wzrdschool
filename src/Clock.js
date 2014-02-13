var WZRD = (function(WZRD){
    "use strict";
    function Clock(){
        //use this callback whenever you're 
        this._gameTickCallback = function(timestamp){
            this.gameTick(timestamp);
        }.bind(this);
    }
    
    WZRD.Clock = Clock;
}(WZRD || {}));