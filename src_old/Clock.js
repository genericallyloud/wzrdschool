var WZRD = (function(WZRD){
    "use strict";
    function Clock(){}

    Clock.prototype.initTime = function initTime(timestamp){
        this._time = timestamp;
    };

    Clock.prototype.updateTime = function updateTime(timestamp){
        var diff = timestamp - this._time;
        this._time = timestamp;
        return diff;
    };
    
    WZRD.Clock = Clock;
}(WZRD || {}));