var WZRD;
(function (WZRD) {
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
        }
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

        Bounds.prototype.intersectsWith = function (other) {
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
    var Player = (function () {
        function Player(startX, startY) {
            this.velocity = new WZRD.Vector(0, 0);
            this.width = 1;
            this.height = 1.8;

            this.initPosition(startX, startY);
        }
        Player.prototype.writeToBuffer = function (buffer) {
        };

        Player.prototype.update = function (elapsedTime) {
            var moveVector = this.velocity.timesNum(elapsedTime);
            this.position = this.position.plus(moveVector);
            this.bounds.moveXY(moveVector);
        };

        Player.prototype.initPosition = function (x, y) {
            this.position = new WZRD.Vector(x, y);
            var bl = new WZRD.Vector(x - (this.width / 2), y - (this.height / 2));
            var tr = new WZRD.Vector(bl.x + this.width, bl.y + this.height);
            this.bounds = new WZRD.Bounds(bl, tr);
            this.tileLocation = { col: 0, row: 0 };
        };
        return Player;
    })();
    WZRD.Player = Player;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var Camera = (function () {
        function Camera(player) {
            this.player = player;
            var right = player.bounds.getRight();
            var bottom = player.bounds.getBottom();
            this.trackingWindowBounds = new WZRD.Bounds(new WZRD.Vector(right - Camera.TRACKING_WIDTH, bottom), new WZRD.Vector(right, bottom + Camera.TRACKING_HEIGHT));
            this.cameraStyle = 0 /* GROUND_LOCK */;
            this.leadingEdge = 1 /* RIGHT */;
        }
        Camera.prototype.update = function (elapsedTime) {
            this.updateX(elapsedTime);
        };

        Camera.prototype.updateX = function (elapsedTime) {
            var diff = this.player.bounds.insideXOf(this.trackingWindowBounds);

            if (diff == 0)
                return;

            this.trackingWindowBounds.moveX(diff);
            if (diff < 0) {
                this.leadingEdge = 0 /* LEFT */;
            } else {
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

            this.cameraTranslation.x = targetXCenter - this.centerXAdjust;
        };

        Camera.prototype.getCameraTranslation = function () {
            return this.cameraTranslation;
        };

        Camera.prototype.getColumnStartWidth = function () {
            var colStart = ((this.cameraTranslation.x / 32) | 0) - 1;
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
        Camera.MAX_MOVE_RATE = (10 * 32);
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
        return Clock;
    })();
    WZRD.Clock = Clock;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var CollisionManager = (function () {
        function CollisionManager(tileEngine, stateManager) {
            this.tileEngine = tileEngine;
            this.stateManager = stateManager;
        }
        CollisionManager.prototype.update = function () {
        };
        return CollisionManager;
    })();
    WZRD.CollisionManager = CollisionManager;
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
            if (e.keyCode == '37') {
            } else if (e.keyCode == '39') {
            }
            e.preventDefault();
        };
        InputManager.prototype.keyup = function (e) {
            e.preventDefault();
        };
        return InputManager;
    })();
    WZRD.InputManager = InputManager;
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
        return StateManager;
    })();
    WZRD.StateManager = StateManager;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var TileEngine = (function () {
        function TileEngine(camera) {
            this.camera = camera;
        }
        TileEngine.prototype.getColumnRangeBuffer = function (start, count) {
            var startIndex = this.colOffsets[start], endCol = start + count + 1;

            var endIndex = endCol == this.colOffsets.length ? this.dataLength + 1 : this.colOffsets[endCol];
            var floatCount = endIndex - startIndex;

            return { buffer: this.tileData.subarray(startIndex, endIndex), vertexCount: floatCount / 5 };
        };

        TileEngine.loadTextureAtlas = function () {
        };

        TileEngine.parseLevel = function (levelString) {
        };

        TileEngine.createLevelData = function (tileConfig) {
            var colNum, col, xCoord, tileNum, tileOffset, tileVal, color, width = tileConfig.length, height = tileConfig[0].length, buffer = new Float32Array(width * height * 6 * 5), bufferIndex = 0, colOffsets = [];
            for (colNum = 0; colNum < width; colNum++) {
                col = tileConfig[colNum];
                xCoord = colNum * 32;

                colOffsets[colNum] = bufferIndex;
                for (tileNum = 0; tileNum < height; tileNum++) {
                    tileVal = col[tileNum];

                    if (tileVal === 0)
                        continue;

                    color = TileEngine.colors[tileVal - 1];

                    bufferIndex = TileEngine.createTileVertices(xCoord, tileNum * 32, width, height, color, buffer, bufferIndex);
                }
            }

            return [buffer, colOffsets, bufferIndex];
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
        TileEngine.colors = [
            [0.459, 0.376, 0.09],
            [0.137, 0.619, 0]
        ];
        return TileEngine;
    })();
    WZRD.TileEngine = TileEngine;
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
            this.drawTileLayer();
        };

        RenderManager.prototype.updateSize = function (canvas) {
            var width = window.innerWidth, height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            this.camera.onResize(width, height);
        };

        RenderManager.prototype.drawTileLayer = function () {
            var colStartWidth = this.camera.getColumnStartWidth();
            var columnRange = this.tileEngine.getColumnRangeBuffer(colStartWidth[0], colStartWidth[1]);
            var verticesColors = columnRange.buffer;
            var n = columnRange.vertexCount;

            if (n < 0) {
                console.log('Failed to set the vertex information');
                return;
            }

            var gl = this.gl;

            this.initVertexBuffers(gl, this.program, verticesColors, n);

            gl.clearColor(0.9, 0.9, 1.0, 1.0);

            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.drawArrays(gl.TRIANGLES, 0, n);
        };

        RenderManager.prototype.updatePosition = function () {
            var translationAmount = this.gl.getUniformLocation(this.program, "u_Translation");
            var startWidth = this.camera.getColumnStartWidth();
            this.gl.uniform2f(translationAmount, startWidth.start, startWidth.width);
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
    function log(msg) {
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
    }

    function error(msg) {
        if (window.console) {
            if (window.console.error) {
                window.console.error(msg);
            } else if (window.console.log) {
                window.console.log(msg);
            }
        }
    }

    function loggingOff() {
        log = function () {
        };
        error = function () {
        };
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
        if (isInIFrame()) {
            updateCSSIfInIFrame();

            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        } else {
            var title = document.getElementsByTagName("title")[0].innerText;
            var h1 = document.createElement("h1");
            h1.innerText = title;
            document.body.insertBefore(h1, document.body.children[0]);
        }

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
                WZRD.requestAnimFrame(_this.gameTickCallback);
            };

            this.paused = false;

            this.clock = new WZRD.Clock();
            this.inputManager = new WZRD.InputManager(this);

            this.player = new WZRD.Player(32, 32);
            this.camera = new WZRD.Camera(this.player);
            this.tileEngine = new WZRD.TileEngine(this.camera);
            this.stateManager = new WZRD.StateManager(this.tileEngine, this.player);
            this.collisionManager = new WZRD.CollisionManager(this.tileEngine, this.stateManager);
            this.renderManager = new WZRD.RenderManager(this.camera, this.tileEngine, this.stateManager);
        }
        GameEngine.prototype.start = function () {
            this.nextFrame = WZRD.requestAnimFrame(this.firstTick);
            this.paused = false;
        };

        GameEngine.prototype.pause = function () {
            WZRD.cancelRequestAnimFrame(this.nextFrame);
            this.paused = true;
        };

        GameEngine.prototype.gameTick = function (timestamp) {
            var elapsedTime = this.clock.updateTime(timestamp);
            this.stateManager.update(elapsedTime);
            this.collisionManager.update();
            this.camera.update(elapsedTime);
            this.renderManager.draw();

            WZRD.requestAnimFrame(this.gameTickCallback);
        };

        GameEngine.prototype.moveLeft = function () {
        };
        return GameEngine;
    })();
    WZRD.GameEngine = GameEngine;

    WZRD.GRAVITY = 1;
    WZRD.TILE_SIZE = 32;
})(WZRD || (WZRD = {}));
var WZRD;
(function (WZRD) {
    var WzrdSchool = (function () {
        function WzrdSchool() {
            this.engine = new WZRD.GameEngine();
        }
        WzrdSchool.prototype.start = function () {
            this.engine.start();
        };
        return WzrdSchool;
    })();
    WZRD.WzrdSchool = WzrdSchool;

    function main() {
        new WzrdSchool().start();
    }
    WZRD.main = main;
})(WZRD || (WZRD = {}));
