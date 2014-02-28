var WZRD = (function(WZRD){
    "use strict";

    function WzrdSchool(){
        this.engine = new WZRD.GameEngine();
    }
    WzrdSchool.prototype.start = function start(){
    };

    WZRD.WzrdSchool = WzrdSchool;

    WZRD.main = function(){
        WZRD.game = new WzrdSchool();
        WZRD.game.start();
    }

    //some constants
    WZRD.GRAVITY = 1;
    WZRD.TILE_SIZE = 32;

}(WZRD || {}));