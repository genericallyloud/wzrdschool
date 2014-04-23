///<reference path="qunit.d.ts"/>
///<reference path="../src/TileEngine.ts"/>
///<reference path="../src/Camera.ts"/>
///<reference path="MockCamera.ts"/>
module WZRD {
    QUnit.module("TileEngineTest");
    test("getCollisionTilesForBounds", function() {
        var tileEngine = new TileEngine(new MockCamera(null));
        var testBounds = new Bounds(new Vector(0,0),new Vector(31,63));
        testBounds.moveX(25);
        testBounds.moveY(5);
        var tiles = tileEngine.getCollisionTilesForBounds(testBounds);
        equal(tiles.length,2,"should be 2 cols");
        equal(tiles[0].length,3,"should 3 rows high");
    });
}