///<reference path="qunit.d.ts"/>
///<reference path="../src/Bounds.ts"/>
///<reference path="../src/Vector.ts"/>
///<reference path="../src/CollisionTile.ts"/>
///<reference path="../src/SpriteTileCollisionResolver.ts"/>
module WZRD {
    var blockTileDef:TileDef = {
        tileCollisionType:TileCollisionType.BLOCK
    };
    
    
    QUnit.module("SpriteTileCollisionResolverTest");
    test("hitCornerAbove", function() {
        var boundsFinalPosition = Bounds.fromEdgesObject({
           bottom:16,left:48,top:70,right:80 
        });
        var moveVector = new Vector(32,-64);
        var empty = EMPTY_TILE;
        var tiles:CollisionTile[][] = [
            [empty,empty,empty],
            [new BlockTile(blockTileDef,2,0,32),empty,empty]
        ];

        var collisionResolver = new SpriteTileCollisionResolver(boundsFinalPosition, moveVector, tiles);
        var adjustment = collisionResolver.getAdjustment();
        equal(adjustment.y,16,"needs to be adjusted vertically by 16 pixels");
        equal(adjustment.x,0,"no horizontal adjustment because it should hit on the top");
        
    });
    
    test("hitCornerLeft", function() {
        var boundsFinalPosition = Bounds.fromEdgesObject({
           bottom:16,left:48,top:70,right:80 
        });
        var moveVector = new Vector(64,-32);
        var empty = EMPTY_TILE;
        var tiles:CollisionTile[][] = [
            [empty,empty,empty],
            [new BlockTile(blockTileDef,2,0,32),empty,empty]
        ];

        var collisionResolver = new SpriteTileCollisionResolver(boundsFinalPosition, moveVector, tiles);
        var adjustment = collisionResolver.getAdjustment();
        equal(adjustment.y,0,"no vertical adjustment because it should hit on the left");
        equal(adjustment.x,-17,"needs to move left by enough to be one pixel left of the block (block left edge is 64px)");
        
    });
    
    test("movingOverGround", function() {
        var boundsFinalPosition = Bounds.fromEdgesObject({
           bottom:27,left:48,top:27+64,right:48+32 
        });
        var moveVector = new Vector(10,-5);
        var empty = EMPTY_TILE;
        var tiles:CollisionTile[][] = [
            [new BlockTile(blockTileDef,1,0,32),empty,empty],
            [new BlockTile(blockTileDef,2,0,32),empty,empty]
        ];
        
        var collisionResolver = new SpriteTileCollisionResolver(boundsFinalPosition, moveVector, tiles);
        var adjustment = collisionResolver.getAdjustment();
        equal(adjustment.y,5,"need to vertically adjust back above ground level");
        equal(adjustment.x,0,"should move over the ground without interacting");
        
    });
    
    test("hitting a wall", function() {
        var boundsFinalPosition = Bounds.fromEdgesObject({
           bottom:27,left:48,top:27+64,right:48+32 
        });
        var moveVector = new Vector(30,-5);
        var empty = EMPTY_TILE;
        var tiles:CollisionTile[][] = [
            [new BlockTile(blockTileDef,1,0,32),empty,empty],
            [new BlockTile(blockTileDef,2,0,32),new BlockTile(blockTileDef,2,1,32),new BlockTile(blockTileDef,2,2,32)]
        ];
        
        var collisionResolver = new SpriteTileCollisionResolver(boundsFinalPosition, moveVector, tiles);
        var adjustment = collisionResolver.getAdjustment();
        equal(adjustment.y,5,"need to vertically adjust back above ground level");
        equal(adjustment.x,-17,"need to adjust left to the edge of the wall");
        
    });
}