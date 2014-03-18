///<reference path="qunit.d.ts"/>
///<reference path="../src/Bounds.ts"/>
///<reference path="../src/Vector.ts"/>
module WZRD {
    QUnit.module("BoundsTest");
    test("intersectsLeft", function() {
        var b0 = new Bounds(new Vector(0,0),new Vector(50,50));
        var b1 = b0.copy();
        b1.moveX(-10);
        var overlap = b1.intersectsLeft(b0);
        equal(overlap,-40,"The two bounds should overlap by 40 pixels on the left");
        equal(b0.intersectsLeft(b1),0,"The reverse shouldn't be true because b0 is to the right of b1, not to the left.")
    });
    test("intersectsRight", function() {
        var b0 = new Bounds(new Vector(0,0),new Vector(50,50));
        var b1 = b0.copy();
        b1.moveX(10);
        var overlap = b1.intersectsRight(b0);
        equal(overlap,40,"The two bounds should overlap by 40 pixels on the right");
        equal(b0.intersectsRight(b1),0,"The reverse shouldn't be true because b0 is to the left of b1, not to the right.")
    });
}