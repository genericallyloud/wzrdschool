///<reference path="Camera.ts"/>
///<reference path="Clock.ts"/>
///<reference path="CollisionManager.ts"/>
///<reference path="InputManager.ts"/>
///<reference path="Player.ts"/>
///<reference path="RenderManager.ts"/>
///<reference path="StateManager.ts"/>
///<reference path="TileEngine.ts"/>
///<reference path="webgl-utils.ts"/>
module WZRD {
    export class GameEngine {
        private camera:Camera;
        private clock:Clock;
        private collisionManager:CollisionManager;
        private inputManager:InputManager;
        private player:Player;
        private renderManager:RenderManager;
        private stateManager:StateManager;
        private tileEngine:TileEngine;

        private gameTickCallback:GameTickCallback;
        private firstTick:GameTickCallback;
        private paused:boolean;
        private nextFrame:number;

        constructor(){
            //use this callback for every normal game tick. Stashed on this for reuse while
            //while maintaining pointer to this. Not a static function
            this.gameTickCallback = (timestamp) => this.gameTick(timestamp);

            this.firstTick = (timestamp) => {
                //the first tick shouldn't do anything other than get the clock
                //initialized and ready for use in subsequent calls. This is basically
                //a lost from that doesn't update or draw, but shouldn't really be noticeable
                this.clock.initTime(timestamp);
                requestAnimFrame(this.gameTickCallback);
            };

            this.paused = false;

            //create all of the other systems

            this.clock = new Clock();
            this.inputManager = new InputManager(this);

            this.player = new Player(32,32);
            this.camera = new Camera(this.player);
            this.tileEngine = new TileEngine(this.camera);
            this.stateManager = new StateManager(this.tileEngine,this.player);
            this.collisionManager = new CollisionManager(this.tileEngine, this.stateManager);
            this.renderManager = new RenderManager(this.camera,this.tileEngine, this.stateManager);
        }



        start(){
            this.nextFrame = requestAnimFrame(this.firstTick);
            this.paused = false;
        }

        pause(){
            cancelRequestAnimFrame(this.nextFrame);
            this.paused = true;
        }

        gameTick(timestamp){
            var elapsedTime = this.clock.updateTime(timestamp);
            this.stateManager.update(elapsedTime);
            this.collisionManager.update();
            this.camera.update(elapsedTime);
            this.renderManager.draw();

            requestAnimFrame(this.gameTickCallback);
        }

        moveLeft(){

        }
    }

    interface GameTickCallback {
        (timestamp:number):void;
    }

    export var GRAVITY = 1;
    export var TILE_SIZE = 32;
}