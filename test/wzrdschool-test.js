var WZRD;
(function (WZRD) {
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector.prototype.copy = function () {
            return new Vector(this.x, this.y);
        };

        Vector.prototype.plus = function (v) {
            return new Vector(this.x + v.x, this.y + v.y);
        };

        Vector.prototype.minus = function (v) {
            return new Vector(this.x - v.x, this.y - v.y);
        };

        Vector.prototype.times = function (v) {
            return new Vector(this.x * v.x, this.y * v.y);
        };

        Vector.prototype.timesNum = function (n) {
            return new Vector(this.x * n, this.y * n);
        };
        return Vector;
    })();
    WZRD.Vector = Vector;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var Bounds = (function () {
        function Bounds(bottomLeft, topRight) {
            this.bottomLeft = bottomLeft;
            this.topRight = topRight;
        }
        Bounds.prototype.getBottom = function () {
            return this.bottomLeft.y;
        };

        Bounds.prototype.getTop = function () {
            return this.topRight.y;
        };

        Bounds.prototype.getRight = function () {
            return this.topRight.x;
        };

        Bounds.prototype.getLeft = function () {
            return this.bottomLeft.x;
        };

        Bounds.prototype.intersectsLeft = function (other) {
            debugger;
            if (this.getRight() > other.getLeft() && this.getLeft() < other.getLeft()) {
                return other.getLeft() - this.getRight();
            } else {
                return 0;
            }
        };

        Bounds.prototype.intersectsRight = function (other) {
            return other.intersectsLeft(this) * -1;
        };

        Bounds.prototype.intersectsTop = function (other) {
            if (this.getBottom() < other.getTop() && this.getTop() > other.getTop()) {
                return other.getTop() - this.getBottom();
            } else {
                return 0;
            }
        };

        Bounds.prototype.intersectsBottom = function (other) {
            return other.intersectsTop(this) * -1;
        };

        Bounds.prototype.insideXOf = function (other) {
            if (this.bottomLeft.x < other.bottomLeft.x)
                return this.bottomLeft.x - other.bottomLeft.x;
            if (this.topRight.x > other.topRight.x)
                return this.topRight.x - other.topRight.x;
            return 0;
        };

        Bounds.prototype.insideYOf = function (other) {
            if (this.bottomLeft.y < other.bottomLeft.y)
                return this.bottomLeft.y - other.bottomLeft.y;
            if (this.topRight.y > other.topRight.y)
                return this.topRight.y - other.topRight.y;
            return 0;
        };

        Bounds.prototype.moveX = function (x) {
            this.bottomLeft.x += x;
            this.topRight.x += x;
        };

        Bounds.prototype.moveY = function (y) {
            this.bottomLeft.y += y;
            this.topRight.y += y;
        };

        Bounds.prototype.moveXY = function (moveVector) {
            this.bottomLeft = this.bottomLeft.plus(moveVector);
            this.topRight = this.topRight.plus(moveVector);
        };

        Bounds.prototype.copy = function () {
            return new Bounds(this.bottomLeft.copy(), this.topRight.copy());
        };

        Bounds.prototype.getEdge = function (edge) {
            if (edge == 0 /* LEFT */) {
                return this.getLeft();
            } else if (edge == 1 /* RIGHT */) {
                return this.getRight();
            } else if (edge == 2 /* TOP */) {
                return this.getTop();
            } else {
                return this.getBottom();
            }
        };
        return Bounds;
    })();
    WZRD.Bounds = Bounds;

    (function (Edge) {
        Edge[Edge["LEFT"] = 0] = "LEFT";
        Edge[Edge["RIGHT"] = 1] = "RIGHT";
        Edge[Edge["TOP"] = 2] = "TOP";
        Edge[Edge["BOTTOM"] = 3] = "BOTTOM";
    })(WZRD.Edge || (WZRD.Edge = {}));
    var Edge = WZRD.Edge;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    QUnit.module("BoundsTest");
    test("intersectsLeft", function () {
        var b0 = new WZRD.Bounds(new WZRD.Vector(0, 0), new WZRD.Vector(50, 50));
        var b1 = b0.copy();
        b1.moveX(-10);
        var overlap = b1.intersectsLeft(b0);
        equal(overlap, -40, "The two bounds should overlap by 40 pixels on the left");
        equal(b0.intersectsLeft(b1), 0, "The reverse shouldn't be true because b0 is to the right of b1, not to the left.");
    });
    test("intersectsRight", function () {
        var b0 = new WZRD.Bounds(new WZRD.Vector(0, 0), new WZRD.Vector(50, 50));
        var b1 = b0.copy();
        b1.moveX(10);
        var overlap = b1.intersectsRight(b0);
        equal(overlap, 40, "The two bounds should overlap by 40 pixels on the right");
        equal(b0.intersectsRight(b1), 0, "The reverse shouldn't be true because b0 is to the left of b1, not to the right.");
    });
})(WZRD || (WZRD = {}));
