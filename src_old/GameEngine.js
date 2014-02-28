var WZRD = (function(WZRD){
    function GameEngine(){
        //use this callback for every normal game tick. Stashed on this for reuse while
        //while maintaining pointer to this. Not a static function
        this._gameTickCallback = function(timestamp){
            this.gameTick(timestamp);
        }.bind(this);
        
        this._firstTick = function(timestamp){
            //the first tick shouldn't do anything other than get the clock
            //initialized and ready for use in subsequent calls. This is basically
            //a lost from that doesn't update or draw, but shouldn't really be noticeable
            this.clock.initTime(timestamp);
            window.requestAnimFrame(this._gameTickCallback);
        }.bind(this);
        this._paused = false;
        
        //create all of the other systems
        
        this.clock = new WZRD.Clock();
        this.inputManager = new WZRD.InputManager(this);
        
        this.tileEngine = new WZRD.TileEngine();
        this.camera = new WZRD.Camera(this.tileEngine);
        this.player = new WZRD.Player();
        this.spriteManager = new WZRD.SpriteManager(this.tileEngine,this.player);
        this.collisionManager = new WZRD.CollisionManager(this.tileEngine, this.spriteManager);
        this.renderManager = new WZRD.RenderManager(this.tileEngine, this.spriteManager);
    }
    
    GameEngine.prototype.start = function start(){
        this.nextFrame = window.requestAnimFrame(this._firstTick);
        this._paused = false;
    }
    
    GameEngine.prototype.pause = function pause(){
        window.cancelAnimationFrame(this.nextFrame);
        this._paused = true;
    }
    
    GameEngine.prototype.gameTick = function gameTick(timestamp){
        var elapsedTime = this.clock.updateTime(timestamp);
        this.spriteManager.update(elapsedTime);
        this.collisionManager.update();
        this.renderManager.draw();
        
        window.requestAnimFrame(this._gameTickCallback);
    }

    GameEngine.prototype.moveLeft = function(){

    }
    
    WZRD.GameEngine = GameEngine;
}(WZRD || {}));