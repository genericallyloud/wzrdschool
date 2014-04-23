///<reference path="StateManager.ts"/>
///<reference path="TileEngine.ts"/>
///<reference path="Sprite.ts"/>
///<reference path="Bounds.ts"/>
///<reference path="SpriteTileCollisionResolver.ts"/>
module WZRD {
    export class CollisionManager {
        private tileEngine:TileEngine;
        private stateManager:StateManager;

        constructor(tileEngine, stateManager){
            this.tileEngine = tileEngine;
            this.stateManager = stateManager;
        }

        update(){
            //for each sprite within a certain column range (clearly need to manage this way)
            //need to test against the tiles for collision
            var sprites:Sprite[] = this.stateManager.getActiveSprites();
            sprites.forEach((s:Sprite)=>{
                var bounds:Bounds = s.bounds,
                    tiles = this.tileEngine.getCollisionTilesForBounds(bounds),
                    adjustment = new SpriteTileCollisionResolver(bounds, s.velocity, tiles).getAdjustment();
                bounds.moveXY(adjustment);
                if(adjustment.x > 0){
                    s.velocity.x = 0;
                    s.collide(Edge.LEFT);
                }else if(adjustment.x < 0){
                    s.velocity.x = 0;
                    s.collide(Edge.RIGHT);
                }else if(adjustment.y > 0){
                    s.velocity.y = 0;
                    s.collide(Edge.BOTTOM);
                }else if(adjustment.y < 0){
                    s.velocity.y = 0;
                    s.collide(Edge.TOP);
                }
            });
            
            //after the tile phase, need to test against the other sprites. Use a quadtree for this?
        }
    }
}