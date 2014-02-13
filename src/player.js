var WZRD = (function(WZRD){
    "use strict";
    
    function Player(startX,startY){
        this.position = {x:startX,y:startY};
        this.velocity = {x:0,y:0};
        this.tileLocation = {col:0,row:0};
        this.width = 32;
        this.height = 64;
    }
    
    WZRD.Player = Player;
}(WZRD || {}));