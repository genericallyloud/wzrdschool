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

        Bounds.prototype.getOppositeEdge = function (edge) {
            return this.getEdge(toOppositeEdge(edge));
        };

        Bounds.fromEdgesBLTR = function (bottom, left, top, right) {
            return new Bounds(new WZRD.Vector(left, bottom), new WZRD.Vector(right, top));
        };
        Bounds.fromEdgesObject = function (edges) {
            return new Bounds(new WZRD.Vector(edges.left, edges.bottom), new WZRD.Vector(edges.right, edges.top));
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

    function toOppositeEdge(edge) {
        switch (edge) {
            case 0 /* LEFT */:
                return 1 /* RIGHT */;
            case 1 /* RIGHT */:
                return 0 /* LEFT */;
            case 2 /* TOP */:
                return 3 /* BOTTOM */;
            case 3 /* BOTTOM */:
                return 2 /* TOP */;
        }
    }
    WZRD.toOppositeEdge = toOppositeEdge;
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
var WZRD;
(function (WZRD) {
    var MockCamera = (function () {
        function MockCamera(player) {
        }
        MockCamera.prototype.update = function (elapsedTime) {
        };

        MockCamera.prototype.getCameraTranslation = function () {
            return new WZRD.Vector(0, 0);
        };

        MockCamera.prototype.getColumnStartWidth = function () {
            return { start: 0, width: 30 };
        };

        MockCamera.prototype.onResize = function (width, height) {
        };

        MockCamera.prototype.onLevelChange = function (maxTileCol) {
        };
        return MockCamera;
    })();
    WZRD.MockCamera = MockCamera;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var EmptyTile = (function () {
        function EmptyTile() {
        }
        EmptyTile.prototype.isSlope = function () {
            return false;
        };
        EmptyTile.prototype.getSlopeY = function (x) {
            return 0;
        };
        EmptyTile.prototype.getSide = function (collisionSide) {
            return 0;
        };
        EmptyTile.prototype.isCollision = function (edge) {
            return false;
        };
        EmptyTile.prototype.anyCollision = function () {
            return false;
        };
        return EmptyTile;
    })();

    WZRD.EMPTY_TILE = new EmptyTile();

    var BlockTile = (function () {
        function BlockTile(tileDef, col, row, tileSize) {
            if (!tileDef) {
                debugger;
                console.log("no tiledef - wtf");
            }
            this.tileDef = tileDef;
            this.col = col;
            this.row = row;
            this.tileSize = tileSize;
        }
        BlockTile.prototype.isSlope = function () {
            return this.tileDef.tileCollisionType === 2 /* SLOPE */;
        };
        BlockTile.prototype.getSlopeY = function (x) {
            return this.tileDef.slope(x);
        };
        BlockTile.prototype.getSide = function (collisionSide) {
            switch (this.tileDef.tileCollisionType) {
                case 0 /* NONE */:
                case 2 /* SLOPE */:
                    return 0;
                case 1 /* BLOCK */:
                case 3 /* EDGE */:
                    return tileEdgeToPx(this.col, this.row, collisionSide, this.tileSize);
            }
        };
        BlockTile.prototype.isCollision = function (edge) {
            switch (this.tileDef.tileCollisionType) {
                case 0 /* NONE */:
                    return false;
                case 1 /* BLOCK */:
                    return true;
                case 2 /* SLOPE */:
                    return edge == 2 /* TOP */ || edge == 3 /* BOTTOM */;
                case 3 /* EDGE */:
                    return _.contains(this.tileDef.sides, edge);
            }
        };
        BlockTile.prototype.anyCollision = function () {
            return this.tileDef.tileCollisionType != 0 /* NONE */;
        };
        return BlockTile;
    })();
    WZRD.BlockTile = BlockTile;

    function tileEdgeToPx(col, row, edge, tileSize) {
        switch (edge) {
            case 2 /* TOP */:
                return (row + 1) * tileSize - 1;
            case 3 /* BOTTOM */:
                return row * tileSize;
            case 0 /* LEFT */:
                return col * tileSize;
            case 1 /* RIGHT */:
                return (col + 1) * tileSize - 1;
        }
    }
    WZRD.tileEdgeToPx = tileEdgeToPx;

    (function (TileCollisionType) {
        TileCollisionType[TileCollisionType["NONE"] = 0] = "NONE";
        TileCollisionType[TileCollisionType["BLOCK"] = 1] = "BLOCK";
        TileCollisionType[TileCollisionType["SLOPE"] = 2] = "SLOPE";
        TileCollisionType[TileCollisionType["EDGE"] = 3] = "EDGE";
    })(WZRD.TileCollisionType || (WZRD.TileCollisionType = {}));
    var TileCollisionType = WZRD.TileCollisionType;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    (function (Levels) {
        Levels.test = {
            tileConfig: [
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };
    })(WZRD.Levels || (WZRD.Levels = {}));
    var Levels = WZRD.Levels;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var TileEngine = (function () {
        function TileEngine(camera) {
            this.camera = camera;
            var levelData = TileEngine.createLevelData(WZRD.Levels.test.tileConfig);
            this.tileData = levelData.buffer;
            this.tiles = levelData.tiles;
            this.colOffsets = levelData.colOffsets;
            this.dataLength = levelData.bufferIndex;
            this.colMax = this.colOffsets.length - 31;
            this.camera.onLevelChange(this.colMax);
        }
        TileEngine.prototype.getColumnRangeBuffer = function (start, count) {
            var startIndex = this.colOffsets[start], endCol = start + count + 1;

            var endIndex = endCol == this.colOffsets.length ? this.dataLength + 1 : this.colOffsets[endCol];
            var floatCount = endIndex - startIndex;

            return { buffer: this.tileData.subarray(startIndex, endIndex), vertexCount: floatCount / 5 };
        };

        TileEngine.prototype.getCollisionTilesForBounds = function (bounds) {
            var startCol = TileEngine.pixelToTile(bounds.getLeft()), endCol = TileEngine.pixelToTile(bounds.getRight()), startRow = TileEngine.pixelToTile(bounds.getBottom()), endRow = TileEngine.pixelToTile(bounds.getTop()), cols = [], c, r, currCol, currTileDef;
            for (c = startCol; c <= endCol; c++) {
                currCol = [];
                for (r = startRow; r <= endRow; r++) {
                    currTileDef = this.tiles[c][r];
                    currCol.push(new WZRD.BlockTile(currTileDef, c, r, TileEngine.TILE_SIZE));
                }
                cols.push(currCol);
            }
            return cols;
        };

        TileEngine.pixelToTile = function (px) {
            return px / TileEngine.TILE_SIZE | 0;
        };

        TileEngine.loadTextureAtlas = function () {
        };

        TileEngine.parseLevel = function (levelString) {
        };

        TileEngine.createLevelData = function (tileConfig) {
            var colNum, col, xCoord, tileNum, tileOffset, tileVal, color, width = tileConfig.length, height = tileConfig[0].length, buffer = new Float32Array(width * height * 6 * 5), bufferIndex = 0, colOffsets = [], tiles = [], tilesRow;

            for (colNum = 0; colNum < width; colNum++) {
                col = tileConfig[colNum];
                xCoord = colNum * 32;

                colOffsets[colNum] = bufferIndex;
                tilesRow = [];
                tiles[colNum] = tilesRow;
                for (tileNum = 0; tileNum < height; tileNum++) {
                    tileVal = col[tileNum];
                    tilesRow[tileNum] = TileEngine.tileTypes[tileVal];

                    if (tileVal === 0)
                        continue;

                    color = TileEngine.colors[tileVal - 1];

                    bufferIndex = TileEngine.createTileVertices(xCoord, tileNum * 32, width, height, color, buffer, bufferIndex);
                }
            }

            return { buffer: buffer, colOffsets: colOffsets, bufferIndex: bufferIndex, tiles: tiles };
        };

        TileEngine.createTileVertices = function (x, y, width, height, color, buffer, bufferIndex) {
            var bottom = y, top = y + 32, left = x, right = x + 32;

            bufferIndex = TileEngine.createTileVertex(left, bottom, color, buffer, bufferIndex);

            bufferIndex = TileEngine.createTileVertex(right, bottom, color, buffer, bufferIndex);

            bufferIndex = TileEngine.createTileVertex(left, top, color, buffer, bufferIndex);

            bufferIndex = TileEngine.createTileVertex(left, top, color, buffer, bufferIndex);

            bufferIndex = TileEngine.createTileVertex(right, bottom, color, buffer, bufferIndex);

            bufferIndex = TileEngine.createTileVertex(right, top, color, buffer, bufferIndex);

            return bufferIndex;
        };

        TileEngine.createTileVertex = function (x, y, color, buffer, bufferIndex) {
            buffer.set([x, y, color[0], color[1], color[2]], bufferIndex);
            return bufferIndex + 5;
        };
        TileEngine.tileTypes = [
            Object.freeze({
                name: "air",
                tileCollisionType: 0 /* NONE */
            }),
            Object.freeze({
                name: "dirt",
                tileCollisionType: 1 /* BLOCK */
            }),
            Object.freeze({
                name: "grass",
                tileCollisionType: 1 /* BLOCK */
            }),
            Object.freeze({
                name: "slope up",
                tileCollisionType: 2 /* SLOPE */,
                slope: function (x) {
                    return x;
                }
            }),
            Object.freeze({
                name: "slope down",
                tileCollisionType: 2 /* SLOPE */,
                slope: function (x) {
                    return TileEngine.TILE_SIZE - x;
                }
            })
        ];

        TileEngine.colors = [
            [0.459, 0.376, 0.09],
            [0.137, 0.619, 0]
        ];

        TileEngine.TILE_SIZE = 32;
        return TileEngine;
    })();
    WZRD.TileEngine = TileEngine;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var SpriteTileCollisionResolver = (function () {
        function SpriteTileCollisionResolver(bounds, move, tiles) {
            this.bounds = bounds;
            this.move = move;
            this.tiles = tiles;

            this.width = tiles.length;
            this.height = tiles[0].length;

            if (move.x > 0) {
                this.xEdge = this.width - 1;
                this.xPreEdge = this.xEdge - 1;
                this.xCollisionSide = 0 /* LEFT */;
            } else {
                this.xEdge = 0;
                this.xPreEdge = 1;
                this.xCollisionSide = 1 /* RIGHT */;
            }

            if (move.y > 0) {
                this.yEdge = this.height - 1;
                this.yPreEdge = this.yEdge - 1;
                this.yCollisionSide = 3 /* BOTTOM */;
            } else {
                this.yEdge = 0;
                this.yPreEdge = 1;
                this.yCollisionSide = 2 /* TOP */;
            }

            var isSingleCorner = this.adjustSingleCorner();
            if (!isSingleCorner) {
                var xAdjust = this.adjustX();

                var yAdjust = this.adjustY();
                this.adjustment = new WZRD.Vector(xAdjust, yAdjust);
            }
        }
        SpriteTileCollisionResolver.prototype.getAdjustment = function () {
            return this.adjustment;
        };

        SpriteTileCollisionResolver.prototype.adjustSingleCorner = function () {
            var _this = this;
            var cornerTile = this.tiles[this.xEdge][this.yEdge];

            if (cornerTile.isCollision(this.xCollisionSide) && cornerTile.isCollision(this.yCollisionSide)) {
                var xCount = _.filter(this.tiles[this.xEdge], function (tile) {
                    return tile.isCollision(_this.xCollisionSide);
                }).length;
                var yCount = _.filter(this.tiles, function (col) {
                    return col[_this.yEdge].isCollision(_this.yCollisionSide);
                }).length;
                if (xCount == 1 && yCount == 1) {
                    var xCollision = this.isCollisionOnX(cornerTile), overlapEdge, correction;
                    if (xCollision) {
                        overlapEdge = this.bounds.getOppositeEdge(this.xCollisionSide);
                        correction = cornerTile.getSide(this.xCollisionSide) - overlapEdge;
                        correction += correction > 0 ? 1 : -1;
                        this.adjustment = new WZRD.Vector(correction, 0);
                    } else {
                        overlapEdge = this.bounds.getOppositeEdge(this.yCollisionSide);
                        correction = cornerTile.getSide(this.yCollisionSide) - overlapEdge;
                        correction += correction > 0 ? 1 : -1;
                        this.adjustment = new WZRD.Vector(0, correction);
                    }
                    return true;
                }
            }
            return false;
        };

        SpriteTileCollisionResolver.prototype.isCollisionOnX = function (cornerTile) {
            var boundsCorner = new WZRD.Vector(this.bounds.getOppositeEdge(this.xCollisionSide), this.bounds.getOppositeEdge(this.yCollisionSide));

            var slope = this.move.y / this.move.x;
            var yIntercept = boundsCorner.y - (slope * boundsCorner.x);

            var tileX = cornerTile.getSide(this.xCollisionSide);
            var intersectY = slope * tileX + yIntercept;
            var tileY = cornerTile.getSide(this.yCollisionSide);

            if (this.yCollisionSide == 3 /* BOTTOM */) {
                return intersectY >= tileY;
            } else {
                return intersectY <= tileY;
            }
        };

        SpriteTileCollisionResolver.prototype.adjustX = function () {
            var _this = this;
            var allX = _.chain(_.zip(this.tiles[this.xEdge], this.tiles[this.xPreEdge])).filter(function (tPair) {
                return tPair[0].anyCollision() && (!tPair[1].anyCollision());
            }).map(function (tPair) {
                return tPair[0].getSide(_this.xCollisionSide);
            }).value();
            if (allX.length == 0) {
                return 0;
            } else if (this.xCollisionSide == 1 /* RIGHT */) {
                return _.max(allX) + 1 - this.bounds.getLeft();
            } else {
                return _.min(allX) - 1 - this.bounds.getRight();
            }
        };

        SpriteTileCollisionResolver.prototype.adjustY = function () {
            var _this = this;
            var midPoint = (this.bounds.getLeft() + this.bounds.getRight()) / 2;

            var midPointTile = WZRD.TileEngine.pixelToTile(midPoint);
            var midPointOffset = midPointTile - WZRD.TileEngine.pixelToTile(this.bounds.getLeft());
            var slopeTile = this.tiles[midPointOffset][this.yPreEdge];
            var anySlopes = _.any(yPairs, function (yp) {
                return yp[0].isSlope() || yp[1].isSlope();
            });
            if (anySlopes) {
                return slopeTile.getSlopeY(this.adjustment.x);
            } else {
                var yPairs = _.zip(this.getYEdgeArray(this.yEdge), this.getYEdgeArray(this.yPreEdge));
                var allY = _.chain(yPairs).filter(function (tPair) {
                    return tPair[0].anyCollision() && (!tPair[1].anyCollision());
                }).map(function (tPair) {
                    return tPair[0].getSide(_this.yCollisionSide);
                }).value();
                if (allY.length == 0) {
                    return 0;
                } else if (this.yCollisionSide == 2 /* TOP */) {
                    return _.max(allY) + 1 - this.bounds.getBottom();
                } else {
                    return _.min(allY) - 1 - this.bounds.getTop();
                }
            }
            return 5;
        };

        SpriteTileCollisionResolver.prototype.getYEdgeArray = function (y) {
            return this.tiles.map(function (col) {
                return col[y];
            });
        };
        return SpriteTileCollisionResolver;
    })();
    WZRD.SpriteTileCollisionResolver = SpriteTileCollisionResolver;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var blockTileDef = {
        tileCollisionType: 1 /* BLOCK */
    };

    QUnit.module("SpriteTileCollisionResolverTest");
    test("hitCornerAbove", function () {
        var boundsFinalPosition = WZRD.Bounds.fromEdgesObject({
            bottom: 16, left: 48, top: 70, right: 80
        });
        var moveVector = new WZRD.Vector(32, -64);
        var empty = WZRD.EMPTY_TILE;
        var tiles = [
            [empty, empty, empty],
            [new WZRD.BlockTile(blockTileDef, 2, 0, 32), empty, empty]
        ];

        var collisionResolver = new WZRD.SpriteTileCollisionResolver(boundsFinalPosition, moveVector, tiles);
        var adjustment = collisionResolver.getAdjustment();
        equal(adjustment.y, 16, "needs to be adjusted vertically by 16 pixels");
        equal(adjustment.x, 0, "no horizontal adjustment because it should hit on the top");
    });

    test("hitCornerLeft", function () {
        var boundsFinalPosition = WZRD.Bounds.fromEdgesObject({
            bottom: 16, left: 48, top: 70, right: 80
        });
        var moveVector = new WZRD.Vector(64, -32);
        var empty = WZRD.EMPTY_TILE;
        var tiles = [
            [empty, empty, empty],
            [new WZRD.BlockTile(blockTileDef, 2, 0, 32), empty, empty]
        ];

        var collisionResolver = new WZRD.SpriteTileCollisionResolver(boundsFinalPosition, moveVector, tiles);
        var adjustment = collisionResolver.getAdjustment();
        equal(adjustment.y, 0, "no vertical adjustment because it should hit on the left");
        equal(adjustment.x, -17, "needs to move left by enough to be one pixel left of the block (block left edge is 64px)");
    });

    test("movingOverGround", function () {
        var boundsFinalPosition = WZRD.Bounds.fromEdgesObject({
            bottom: 27, left: 48, top: 27 + 64, right: 48 + 32
        });
        var moveVector = new WZRD.Vector(10, -5);
        var empty = WZRD.EMPTY_TILE;
        var tiles = [
            [new WZRD.BlockTile(blockTileDef, 1, 0, 32), empty, empty],
            [new WZRD.BlockTile(blockTileDef, 2, 0, 32), empty, empty]
        ];

        var collisionResolver = new WZRD.SpriteTileCollisionResolver(boundsFinalPosition, moveVector, tiles);
        var adjustment = collisionResolver.getAdjustment();
        equal(adjustment.y, 5, "need to vertically adjust back above ground level");
        equal(adjustment.x, 0, "should move over the ground without interacting");
    });

    test("hitting a wall", function () {
        var boundsFinalPosition = WZRD.Bounds.fromEdgesObject({
            bottom: 27, left: 48, top: 27 + 64, right: 48 + 32
        });
        var moveVector = new WZRD.Vector(30, -5);
        var empty = WZRD.EMPTY_TILE;
        var tiles = [
            [new WZRD.BlockTile(blockTileDef, 1, 0, 32), empty, empty],
            [new WZRD.BlockTile(blockTileDef, 2, 0, 32), new WZRD.BlockTile(blockTileDef, 2, 1, 32), new WZRD.BlockTile(blockTileDef, 2, 2, 32)]
        ];

        var collisionResolver = new WZRD.SpriteTileCollisionResolver(boundsFinalPosition, moveVector, tiles);
        var adjustment = collisionResolver.getAdjustment();
        equal(adjustment.y, 5, "need to vertically adjust back above ground level");
        equal(adjustment.x, -17, "need to adjust left to the edge of the wall");
    });
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var Clock = (function () {
        function Clock() {
        }
        Clock.prototype.initTime = function (timestamp) {
            this.time = timestamp;
        };

        Clock.prototype.updateTime = function (timestamp) {
            var diff = timestamp - this.time;
            this.time = timestamp;
            return diff;
        };

        Clock.prototype.getTime = function () {
            return this.time;
        };
        return Clock;
    })();
    WZRD.Clock = Clock;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var StateManager = (function () {
        function StateManager(tileEngine, player) {
            this.tileEngine = tileEngine;
            this.player = player;
        }
        StateManager.prototype.update = function (elapsedTime) {
            this.player.update(elapsedTime);
        };

        StateManager.prototype.getActiveSprites = function () {
            return [this.player];
        };

        StateManager.prototype.getSpriteVertices = function () {
            var spriteCount = 1;
            var vertexCount = spriteCount * 6;
            var buffer = new Float32Array(vertexCount * 5), bufferIndex = 0;
            this.player.writeToBuffer(buffer, bufferIndex);

            return { buffer: buffer, vertexCount: vertexCount };
        };
        return StateManager;
    })();
    WZRD.StateManager = StateManager;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var CollisionManager = (function () {
        function CollisionManager(tileEngine, stateManager) {
            this.tileEngine = tileEngine;
            this.stateManager = stateManager;
        }
        CollisionManager.prototype.update = function () {
            var _this = this;
            var sprites = this.stateManager.getActiveSprites();
            sprites.forEach(function (s) {
                var bounds = s.bounds, tiles = _this.tileEngine.getCollisionTilesForBounds(bounds), adjustment = new WZRD.SpriteTileCollisionResolver(bounds, s.velocity, tiles).getAdjustment();
                bounds.moveXY(adjustment);
                if (adjustment.x > 0) {
                    s.velocity.x = 0;
                    s.collide(0 /* LEFT */);
                } else if (adjustment.x < 0) {
                    s.velocity.x = 0;
                    s.collide(1 /* RIGHT */);
                } else if (adjustment.y > 0) {
                    s.velocity.y = 0;
                    s.collide(3 /* BOTTOM */);
                } else if (adjustment.y < 0) {
                    s.velocity.y = 0;
                    s.collide(2 /* TOP */);
                }
            });
        };
        return CollisionManager;
    })();
    WZRD.CollisionManager = CollisionManager;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var RenderManager = (function () {
        function RenderManager(camera, tileEngine, stateManager) {
            var _this = this;
            this.camera = camera;
            this.tileEngine = tileEngine;
            this.stateManager = stateManager;

            var canvas = document.createElement("canvas");
            canvas.setAttribute("screencanvas", "1");
            this.updateSize(canvas);
            document.body.appendChild(canvas);

            window.addEventListener("resize", function (event) {
                return _this.updateSize(canvas);
            });

            var gl = WZRD.getWebGLContext(canvas);
            if (!gl) {
                return;
            }

            var vertexShader = WZRD.createShaderFromScriptElement(gl, "2d-vertex-shader");
            var fragmentShader = WZRD.createShaderFromScriptElement(gl, "2d-fragment-shader");
            var program = WZRD.createProgram(gl, [vertexShader, fragmentShader]);
            gl.useProgram(program);

            var resolutionLocation = gl.getUniformLocation(program, "u_Resolution");
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

            this.canvas = gl.canvas;
            this.gl = gl;
            this.program = program;
        }
        RenderManager.prototype.draw = function () {
            var gl = this.gl;

            gl.clearColor(0.9, 0.9, 1.0, 1.0);

            gl.clear(gl.COLOR_BUFFER_BIT);
            this.updatePosition();
            this.drawTileLayer();
            this.drawSprites();
        };

        RenderManager.prototype.updateSize = function (canvas) {
            var width = window.innerWidth, height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            this.camera.onResize(width, height);
        };

        RenderManager.prototype.drawTileLayer = function () {
            var colStartWidth = this.camera.getColumnStartWidth();
            var columnRange = this.tileEngine.getColumnRangeBuffer(colStartWidth.start, colStartWidth.width);
            var verticesColors = columnRange.buffer;
            var n = columnRange.vertexCount;

            if (n < 0) {
                console.log('Failed to set the vertex information');
                return;
            }

            var gl = this.gl;

            this.initVertexBuffers(gl, this.program, verticesColors, n);

            gl.drawArrays(gl.TRIANGLES, 0, n);
        };

        RenderManager.prototype.drawSprites = function () {
            var vertices = this.stateManager.getSpriteVertices();
            var verticesColors = vertices.buffer;
            var n = vertices.vertexCount;

            if (n < 0) {
                console.log('Failed to set the vertex information');
                return;
            }

            var gl = this.gl;

            this.initVertexBuffers(gl, this.program, verticesColors, n);

            gl.drawArrays(gl.TRIANGLES, 0, n);
        };

        RenderManager.prototype.updatePosition = function () {
            var translationAmount = this.gl.getUniformLocation(this.program, "u_Translation");
            var translation = this.camera.getCameraTranslation();
            this.gl.uniform2f(translationAmount, translation.x, translation.y);
        };

        RenderManager.prototype.initVertexBuffers = function (gl, program, verticesColors, n) {
            var vertexColorBuffer = gl.createBuffer();
            if (!vertexColorBuffer) {
                console.log('Failed to create the buffer object');
                return;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

            var FSIZE = verticesColors.BYTES_PER_ELEMENT;

            var a_Position = gl.getAttribLocation(program, 'a_Position');
            if (a_Position < 0) {
                console.log('Failed to get the storage location of a_Position');
                return;
            }
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
            gl.enableVertexAttribArray(a_Position);

            var a_Color = gl.getAttribLocation(program, 'a_Color');
            if (a_Color < 0) {
                console.log('Failed to get the storage location of a_Color');
                return;
            }
            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
            gl.enableVertexAttribArray(a_Color);
        };
        return RenderManager;
    })();
    WZRD.RenderManager = RenderManager;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var useLogs = true;

    function log(msg) {
        if (useLogs && window.console && window.console.log) {
            window.console.log(msg);
        }
    }

    function error(msg) {
        if (useLogs && window.console) {
            if (window.console.error) {
                window.console.error(msg);
            } else if (window.console.log) {
                window.console.log(msg);
            }
        }
    }

    function loggingOff() {
        useLogs = false;
    }

    function isInIFrame() {
        return window != window.top;
    }

    function glEnumToString(gl, value) {
        for (var p in gl) {
            if (gl[p] == value) {
                return p;
            }
        }
        return "0x" + value.toString(16);
    }

    function makeFailHTML(msg) {
        return '' + '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' + '<td align="center">' + '<div style="display: table-cell; vertical-align: middle;">' + '<div style="">' + msg + '</div>' + '</div>' + '</td></tr></table>';
    }
    ;

    var GET_A_WEBGL_BROWSER = '' + 'This page requires a browser that supports WebGL.<br/>' + '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

    var OTHER_PROBLEM = '' + "It doesn't appear your computer can support WebGL.<br/>" + '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

    function setupWebGL(canvas, opt_attribs) {
        var showLink = function (str) {
            var container = canvas.parentNode;
            if (container) {
                container.innerHTML = makeFailHTML(str);
            }
        };

        if (!("WebGLRenderingContext" in window)) {
            showLink(GET_A_WEBGL_BROWSER);
            return null;
        }

        var context = create3DContext(canvas, opt_attribs);
        if (!context) {
            showLink(OTHER_PROBLEM);
        }
        return context;
    }

    function create3DContext(canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try  {
                context = canvas.getContext(names[ii], opt_attribs);
            } catch (e) {
            }
            if (context) {
                break;
            }
        }
        return context;
    }

    function updateCSSIfInIFrame() {
        if (isInIFrame()) {
            document.body.className = "iframe";
        }
    }
    WZRD.updateCSSIfInIFrame = updateCSSIfInIFrame;
    ;

    function getWebGLContext(canvas) {
        var gl = setupWebGL(canvas);
        return gl;
    }
    WZRD.getWebGLContext = getWebGLContext;
    ;

    function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
        var errFn = opt_errorCallback || error;

        var shader = gl.createShader(shaderType);

        gl.shaderSource(shader, shaderSource);

        gl.compileShader(shader);

        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            var lastError = gl.getShaderInfoLog(shader);
            errFn("*** Error compiling shader '" + shader + "':" + lastError);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function createProgram(gl, shaders, opt_attribs, opt_locations) {
        var program = gl.createProgram();
        for (var ii = 0; ii < shaders.length; ++ii) {
            gl.attachShader(program, shaders[ii]);
        }
        if (opt_attribs) {
            for (var ii = 0; ii < opt_attribs.length; ++ii) {
                gl.bindAttribLocation(program, (opt_locations ? opt_locations[ii] : ii), opt_attribs[ii]);
            }
        }
        gl.linkProgram(program);

        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            var lastError = gl.getProgramInfoLog(program);
            error("Error in program linking:" + lastError);

            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
    WZRD.createProgram = createProgram;

    function createShaderFromScriptElement(gl, scriptId, opt_shaderType, opt_errorCallback) {
        var shaderType;
        var shaderScript = document.getElementById(scriptId);
        if (!shaderScript) {
            throw ("*** Error: unknown script element" + scriptId);
        }
        var shaderSource = shaderScript.text;

        if (!opt_shaderType) {
            if (shaderScript.type == "x-shader/x-vertex") {
                shaderType = gl.VERTEX_SHADER;
            } else if (shaderScript.type == "x-shader/x-fragment") {
                shaderType = gl.FRAGMENT_SHADER;
            } else if (shaderType != gl.VERTEX_SHADER && shaderType != gl.FRAGMENT_SHADER) {
                throw ("*** Error: unknown shader type");
                return null;
            }
        }

        return loadShader(gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType, opt_errorCallback);
    }
    WZRD.createShaderFromScriptElement = createShaderFromScriptElement;

    WZRD.requestAnimFrame = (function () {
        return window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || function (callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();

    WZRD.cancelRequestAnimFrame = (function () {
        return window["cancelRequestAnimationFrame"] || window["webkitCancelRequestAnimationFrame"] || window["mozCancelRequestAnimationFrame"] || window["oCancelRequestAnimationFrame"] || window.clearTimeout;
    })();
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var GameEngine = (function () {
        function GameEngine() {
            var _this = this;
            this.gameTickCallback = function (timestamp) {
                return _this.gameTick(timestamp);
            };

            this.firstTick = function (timestamp) {
                _this.clock.initTime(timestamp);
                _this.nextFrame = _this.requestAnimationFrame(_this.gameTickCallback);
            };

            this.paused = false;

            this.clock = new WZRD.Clock();
            this.inputManager = new WZRD.InputManager(this);
            this.player = new WZRD.Player(640, 160);
            this.camera = new WZRD.Camera(this.player);
            this.tileEngine = new WZRD.TileEngine(this.camera);
            this.stateManager = new WZRD.StateManager(this.tileEngine, this.player);
            this.collisionManager = new WZRD.CollisionManager(this.tileEngine, this.stateManager);
            this.renderManager = new WZRD.RenderManager(this.camera, this.tileEngine, this.stateManager);
            this.inputManager.start();
        }
        GameEngine.prototype.start = function () {
            this.nextFrame = this.requestAnimationFrame(this.firstTick);
            this.paused = false;
        };

        GameEngine.prototype.pause = function () {
            window.cancelAnimationFrame(this.nextFrame);
            this.paused = true;
        };

        GameEngine.prototype.gameTick = function (timestamp) {
            var elapsedTime = this.clock.updateTime(timestamp);
            this.stateManager.update(elapsedTime);
            this.collisionManager.update();
            this.camera.update(elapsedTime);
            this.renderManager.draw();

            this.nextFrame = this.requestAnimationFrame(this.gameTickCallback);
        };

        GameEngine.prototype.fireInputEvent = function (inputEvent) {
            if (inputEvent == 8 /* PAUSE */) {
                if (this.paused) {
                    this.start();
                } else {
                    this.pause();
                }
            } else {
                this.player.onInput(inputEvent);
            }
        };

        GameEngine.prototype.requestAnimationFrame = function (callback) {
            return window.requestAnimationFrame(callback);
        };
        return GameEngine;
    })();
    WZRD.GameEngine = GameEngine;

    WZRD.GRAVITY = 1;
    WZRD.TILE_SIZE = 32;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var InputManager = (function () {
        function InputManager(gameEngine) {
            var _this = this;
            this.gameEngine = gameEngine;

            this._onkeydown = function (event) {
                return _this.keydown(event);
            };
            this._onkeyup = function (event) {
                return _this.keyup(event);
            };
        }
        InputManager.prototype.start = function () {
            document.addEventListener("keydown", this._onkeydown);
            document.addEventListener("keyup", this._onkeyup);
        };
        InputManager.prototype.pause = function () {
            document.removeEventListener("keydown", this._onkeydown);
            document.removeEventListener("keyup", this._onkeyup);
        };
        InputManager.prototype.keydown = function (e) {
            if (e.keyCode == '65') {
                this.gameEngine.fireInputEvent(0 /* MOVE_LEFT_START */);
            } else if (e.keyCode == '68') {
                this.gameEngine.fireInputEvent(2 /* MOVE_RIGHT_START */);
            } else if (e.keyCode == '32') {
                this.gameEngine.fireInputEvent(4 /* JUMP_START */);
            } else if (e.keyCode == '83') {
                this.gameEngine.fireInputEvent(6 /* DUCK_START */);
            } else if (e.keyCode == '27') {
                this.gameEngine.fireInputEvent(8 /* PAUSE */);
            }
            e.preventDefault();
        };
        InputManager.prototype.keyup = function (e) {
            if (e.keyCode == '65') {
                this.gameEngine.fireInputEvent(1 /* MOVE_LEFT_END */);
            } else if (e.keyCode == '68') {
                this.gameEngine.fireInputEvent(3 /* MOVE_RIGHT_END */);
            } else if (e.keyCode == '32') {
                this.gameEngine.fireInputEvent(5 /* JUMP_END */);
            } else if (e.keyCode == '83') {
                this.gameEngine.fireInputEvent(7 /* DUCK_END */);
            }
            e.preventDefault();
        };
        return InputManager;
    })();
    WZRD.InputManager = InputManager;

    (function (InputEventType) {
        InputEventType[InputEventType["MOVE_LEFT_START"] = 0] = "MOVE_LEFT_START";
        InputEventType[InputEventType["MOVE_LEFT_END"] = 1] = "MOVE_LEFT_END";
        InputEventType[InputEventType["MOVE_RIGHT_START"] = 2] = "MOVE_RIGHT_START";
        InputEventType[InputEventType["MOVE_RIGHT_END"] = 3] = "MOVE_RIGHT_END";
        InputEventType[InputEventType["JUMP_START"] = 4] = "JUMP_START";
        InputEventType[InputEventType["JUMP_END"] = 5] = "JUMP_END";
        InputEventType[InputEventType["DUCK_START"] = 6] = "DUCK_START";
        InputEventType[InputEventType["DUCK_END"] = 7] = "DUCK_END";
        InputEventType[InputEventType["PAUSE"] = 8] = "PAUSE";
    })(WZRD.InputEventType || (WZRD.InputEventType = {}));
    var InputEventType = WZRD.InputEventType;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var Player = (function () {
        function Player(startX, startY) {
            this.velocity = new WZRD.Vector(0, 0);
            this.width = 1 * 32;
            this.height = 2 * 32;
            this.color = [0, 0, 0];
            this.moveType = 0 /* NONE */;
            this.onGround = true;

            this.initPosition(startX, startY);
        }
        Player.prototype.writeToBuffer = function (buffer, bufferIndex) {
            var bottom = this.bounds.getBottom(), top = this.bounds.getTop(), left = this.bounds.getLeft(), right = this.bounds.getRight(), color = this.color;

            bufferIndex = WZRD.TileEngine.createTileVertex(left, bottom, color, buffer, bufferIndex);

            bufferIndex = WZRD.TileEngine.createTileVertex(right, bottom, color, buffer, bufferIndex);

            bufferIndex = WZRD.TileEngine.createTileVertex(left, top, color, buffer, bufferIndex);

            bufferIndex = WZRD.TileEngine.createTileVertex(left, top, color, buffer, bufferIndex);

            bufferIndex = WZRD.TileEngine.createTileVertex(right, bottom, color, buffer, bufferIndex);

            bufferIndex = WZRD.TileEngine.createTileVertex(right, top, color, buffer, bufferIndex);

            return bufferIndex;
        };

        Player.prototype.update = function (elapsedTime) {
            var xVel = this.velocity.x;

            switch (this.moveType) {
                case 1 /* LEFT */:
                case 3 /* BOTH_LEFT */:
                    if (xVel > 0)
                        xVel = 0;
                    xVel -= 25;
                    if (xVel < -600)
                        xVel = -600;
                    break;

                case 2 /* RIGHT */:
                case 4 /* BOTH_RIGHT */:
                    if (xVel < 0)
                        xVel = 0;
                    xVel += 25;
                    if (xVel > 600)
                        xVel = 600;
                    break;

                default:
                    if (xVel < -50) {
                        xVel += 50;
                    } else if (xVel > 50) {
                        xVel -= 50;
                    } else {
                        xVel = 0;
                    }
                    break;
            }

            var perSec = elapsedTime / 1000;
            console.log(perSec);
            var gravity = 1400 * perSec;
            var yVel = this.velocity.y - gravity;
            if (yVel < -500) {
                yVel = -500;
            }
            this.velocity.y = yVel;
            this.velocity.x = xVel;

            var moveVector = this.velocity.timesNum(perSec);

            this.bounds.moveXY(moveVector);
            if (yVel < 0) {
                this.onGround = false;
            }
        };

        Player.prototype.onInput = function (inputEvent) {
            switch (inputEvent) {
                case 0 /* MOVE_LEFT_START */:
                    if (this.moveType == 0 /* NONE */ || this.moveType == 1 /* LEFT */) {
                        this.moveType = 1 /* LEFT */;
                    } else {
                        this.moveType = 3 /* BOTH_LEFT */;
                    }
                    break;
                case 1 /* MOVE_LEFT_END */:
                    if (this.moveType == 1 /* LEFT */ || this.moveType == 0 /* NONE */) {
                        this.moveType = 0 /* NONE */;
                    } else {
                        this.moveType = 2 /* RIGHT */;
                    }
                    break;

                case 2 /* MOVE_RIGHT_START */:
                    if (this.moveType == 0 /* NONE */ || this.moveType == 2 /* RIGHT */) {
                        this.moveType = 2 /* RIGHT */;
                    } else {
                        this.moveType = 4 /* BOTH_RIGHT */;
                    }
                    break;
                case 3 /* MOVE_RIGHT_END */:
                    if (this.moveType == 2 /* RIGHT */ || this.moveType == 0 /* NONE */) {
                        this.moveType = 0 /* NONE */;
                    } else {
                        this.moveType = 1 /* LEFT */;
                    }
                    break;
                case 4 /* JUMP_START */:
                    if (this.onGround) {
                        this.onGround = false;

                        this.velocity.y = 700;
                    }
                    break;
            }
        };

        Player.prototype.collide = function (edge) {
            if (edge == 3 /* BOTTOM */) {
                this.onGround = true;
            }
        };

        Player.prototype.initPosition = function (x, y) {
            var bl = new WZRD.Vector(x - (this.width / 2), y - (this.height / 2));
            var tr = new WZRD.Vector(bl.x + this.width, bl.y + this.height);
            this.bounds = new WZRD.Bounds(bl, tr);
            this.tileLocation = { col: 0, row: 0 };
        };
        return Player;
    })();
    WZRD.Player = Player;

    var MoveType;
    (function (MoveType) {
        MoveType[MoveType["NONE"] = 0] = "NONE";
        MoveType[MoveType["LEFT"] = 1] = "LEFT";
        MoveType[MoveType["RIGHT"] = 2] = "RIGHT";
        MoveType[MoveType["BOTH_LEFT"] = 3] = "BOTH_LEFT";
        MoveType[MoveType["BOTH_RIGHT"] = 4] = "BOTH_RIGHT";
    })(MoveType || (MoveType = {}));
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var Camera = (function () {
        function Camera(player) {
            this.player = player;
            var right = player.bounds.getRight();
            var bottom = player.bounds.getBottom();
            this.trackingWindowBounds = new WZRD.Bounds(new WZRD.Vector(right - Camera.TRACKING_WIDTH, bottom), new WZRD.Vector(right, bottom + Camera.TRACKING_HEIGHT));

            this.cameraTranslation = new WZRD.Vector(16, 16);
            this.cameraStyle = 0 /* GROUND_LOCK */;
            this.leadingEdge = 1 /* RIGHT */;
        }
        Camera.prototype.update = function (elapsedTime) {
            this.updateX(elapsedTime);
        };

        Camera.prototype.updateX = function (elapsedTime) {
            var diff = this.player.bounds.insideXOf(this.trackingWindowBounds);

            this.trackingWindowBounds.moveX(diff);
            if (diff < 0) {
                this.leadingEdge = 0 /* LEFT */;
            } else if (diff > 0) {
                this.leadingEdge = 1 /* RIGHT */;
            }

            var targetXCenter = this.trackingWindowBounds.getEdge(this.leadingEdge);

            var currCenter = this.cameraTranslation.x + this.centerXAdjust;
            if (targetXCenter == currCenter)
                return;

            var maxDistance = (elapsedTime / 1000) * Camera.MAX_MOVE_RATE;
            if (targetXCenter > currCenter) {
                if (targetXCenter - currCenter > maxDistance) {
                    targetXCenter = currCenter + maxDistance;
                }
            } else {
                if (currCenter - targetXCenter > maxDistance) {
                    targetXCenter = currCenter - maxDistance;
                }
            }

            if (targetXCenter < this.centerXAdjust) {
                targetXCenter = this.centerXAdjust;
            } else if (targetXCenter > this.maxTargetX) {
                targetXCenter = this.maxTargetX;
            }

            this.cameraTranslation.x = targetXCenter - this.centerXAdjust;
        };

        Camera.prototype.getCameraTranslation = function () {
            return this.cameraTranslation;
        };

        Camera.prototype.getColumnStartWidth = function () {
            var colStart = ((this.cameraTranslation.x / 32) | 0) - 1;
            if (colStart < 0)
                colStart = 0;
            var colWidth = ((this.canvasWidth / 32) | 0) + 2;
            return { start: colStart, width: colWidth };
        };

        Camera.prototype.onResize = function (width, height) {
            this.centerXAdjust = width / 2;
            this.centerYAdjust = height / 2;
            this.canvasWidth = width;

            this.maxTargetX = (this.maxTileCol * 32) - this.centerXAdjust;
        };

        Camera.prototype.onLevelChange = function (maxTileCol) {
            this.maxTileCol = maxTileCol;
        };

        Camera.TRACKING_WIDTH = 64;
        Camera.TRACKING_HEIGHT = 128;
        Camera.MAX_MOVE_RATE = (20 * 32);
        return Camera;
    })();
    WZRD.Camera = Camera;

    (function (CameraStyle) {
        CameraStyle[CameraStyle["GROUND_LOCK"] = 0] = "GROUND_LOCK";
        CameraStyle[CameraStyle["PLATFORM_LOCK"] = 1] = "PLATFORM_LOCK";
        CameraStyle[CameraStyle["CEILING_LOCK"] = 2] = "CEILING_LOCK";
        CameraStyle[CameraStyle["UNLOCKED"] = 3] = "UNLOCKED";
    })(WZRD.CameraStyle || (WZRD.CameraStyle = {}));
    var CameraStyle = WZRD.CameraStyle;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    QUnit.module("TileEngineTest");
    test("getCollisionTilesForBounds", function () {
        var tileEngine = new WZRD.TileEngine(new WZRD.MockCamera(null));
        var testBounds = new WZRD.Bounds(new WZRD.Vector(0, 0), new WZRD.Vector(31, 63));
        testBounds.moveX(25);
        testBounds.moveY(5);
        var tiles = tileEngine.getCollisionTilesForBounds(testBounds);
        equal(tiles.length, 2, "should be 2 cols");
        equal(tiles[0].length, 3, "should 3 rows high");
    });
})(WZRD || (WZRD = {}));
//# sourceMappingURL=wzrdschool-test.js.map
