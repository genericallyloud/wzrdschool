// Licensed under a BSD license. See ../license.html for license

// These funcitions are meant solely to help unclutter the tutorials.
// They are not meant as production type functions.

///<reference path="webgl.d.ts" />
module WZRD {

    /**
     * Wrapped logging function.
     * @param {string} msg The message to log.
     */
    function log(msg:string) {
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
    }


    /**
     * Wrapped logging function.
     * @param {string} msg The message to log.
     */
    function error(msg:string) {
        if (window.console) {
            if (window.console.error) {
                window.console.error(msg);
            }
            else if (window.console.log) {
                window.console.log(msg);
            }
        }
    }

    /**
     * Turn off all logging.
     */
    function loggingOff() {
        log = function() {};
        error = function() {};
    }

    /**
     * Check if the page is embedded.
     * @return {boolean} True of we are in an iframe
     */
    function isInIFrame() {
        return window != window.top;
    }

    /**
     * Converts a WebGL enum to a string
     * @param {!WebGLContext} gl The WebGLContext to use.
     * @param {number} value The enum value.
     * @return {string} The enum as a string.
     */
    function glEnumToString(gl, value) {
        for (var p in gl) {
            if (gl[p] == value) {
                return p;
            }
        }
        return "0x" + value.toString(16);
    }

    /**
     * Creates the HTLM for a failure message
     * @param {string} canvasContainerId id of container of th
     *        canvas.
     * @return {string} The html.
     */
    function makeFailHTML(msg) {
        return '' +
        '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
        '<td align="center">' +
        '<div style="display: table-cell; vertical-align: middle;">' +
        '<div style="">' + msg + '</div>' +
        '</div>' +
        '</td></tr></table>';
    };

    /**
     * Mesasge for getting a webgl browser
     * @type {string}
     */
    var GET_A_WEBGL_BROWSER = '' +
    'This page requires a browser that supports WebGL.<br/>' +
    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

    /**
     * Mesasge for need better hardware
     * @type {string}
     */
    var OTHER_PROBLEM = '' +
    "It doesn't appear your computer can support WebGL.<br/>" +
    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

    /**
     * Creates a webgl context. If creation fails it will
     * change the contents of the container of the <canvas>
     * tag to an error message with the correct links for WebGL.
     * @param canvas. The canvas element to create a
     *     context from.
     * @param opt_attribs Any
     *     creation attributes you want to pass in.
     * @return The created context.
     */
    function setupWebGL(canvas:HTMLCanvasElement, opt_attribs?):WebGLRenderingContext {
        var showLink = function(str) {
            var container = <HTMLElement>canvas.parentNode;
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

    /**
     * Creates a webgl context.
     * @param canvas The canvas tag to get context
     *     from. If one is not passed in one will be created.
     * @return The created context.
     */
    function create3DContext(canvas:HTMLCanvasElement, opt_attribs?):WebGLRenderingContext {
        var names = ["webgl", "experimental-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], opt_attribs);
            } catch(e) {}
            if (context) {
                break;
            }
        }
        return context;
    }

    export function updateCSSIfInIFrame() {
        if (isInIFrame()) {
            document.body.className = "iframe";
        }
    };

    /**
     * Gets a WebGL context.
     * makes its backing store the size it is displayed.
     */
    export function getWebGLContext(canvas) {
        if (isInIFrame()) {
            updateCSSIfInIFrame();

            // make the canvas backing store the size it's displayed.
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
    };

    /**
     * Loads a shader.
     * @param gl The WebGLContext to use.
     * @param shaderSource The shader source.
     * @param shaderType The type of shader.
     * @param opt_errorCallback callback for errors.
     * @return The created shader.
     */
    function loadShader(gl:WebGLRenderingContext, shaderSource:string, shaderType:number, opt_errorCallback?:(s:string)=>void):WebGLShader {
        var errFn = opt_errorCallback || error;
        // Create the shader object
        var shader = gl.createShader(shaderType);

        // Load the shader source
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check the compile status
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            // Something went wrong during compilation; get the error
            var lastError = gl.getShaderInfoLog(shader);
            errFn("*** Error compiling shader '" + shader + "':" + lastError);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    /**
     * Creates a program, attaches shaders, binds attrib locations, links the
     * program and calls useProgram.
     * @param shaders The shaders to attach
     * @param opt_attribs The attribs names.
     * @param opt_locations The locations for the attribs.
     */
    export function createProgram(gl:WebGLRenderingContext, shaders:WebGLShader[], opt_attribs?:string[], opt_locations?:number[]) {
        var program = gl.createProgram();
        for (var ii = 0; ii < shaders.length; ++ii) {
            gl.attachShader(program, shaders[ii]);
        }
        if (opt_attribs) {
            for (var ii:number = 0; ii < opt_attribs.length; ++ii) {
                gl.bindAttribLocation(
                    program,
                    <number> (opt_locations ? opt_locations[ii] : ii),
                    <string> opt_attribs[ii]);
            }
        }
        gl.linkProgram(program);

        // Check the link status
        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            // something went wrong with the link
            var lastError = gl.getProgramInfoLog (program);
            error("Error in program linking:" + lastError);

            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    /**
     * Loads a shader from a script tag.
     * @param gl The WebGLContext to use.
     * @param scriptId The id of the script tag.
     * @param opt_shaderType The type of shader. If not passed in it will
     *     be derived from the type of the script tag.
     * @param opt_errorCallback callback for errors.
     * @return The created shader.
     */
    export function createShaderFromScriptElement(gl:WebGLRenderingContext, scriptId:string,
                                    opt_shaderType?:number, opt_errorCallback?:(s:string)=>void):WebGLShader {
        var shaderType;
        var shaderScript = <HTMLScriptElement>document.getElementById(scriptId);
        if (!shaderScript) {
            throw("*** Error: unknown script element" + scriptId);
        }
        var shaderSource = shaderScript.text;

        if (!opt_shaderType) {
            if (shaderScript.type == "x-shader/x-vertex") {
                shaderType = gl.VERTEX_SHADER;
            } else if (shaderScript.type == "x-shader/x-fragment") {
                shaderType = gl.FRAGMENT_SHADER;
            } else if (shaderType != gl.VERTEX_SHADER && shaderType != gl.FRAGMENT_SHADER) {
                throw("*** Error: unknown shader type");
                return null;
            }
        }

        return loadShader(
        gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType,
        opt_errorCallback);
    }

    /**
     * Provides requestAnimationFrame in a cross browser way.
     */
    export var requestAnimFrame:(callback:(timestamp:number)=>void)=>number = (function() {
        return window["requestAnimationFrame"] ||
        window["webkitRequestAnimationFrame"] ||
        window["mozRequestAnimationFrame"] ||
        window["oRequestAnimationFrame"] ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            return window.setTimeout(callback, 1000/60);
        };
    })();

    /**
     * Provides cancelRequestAnimationFrame in a cross browser way.
     */
    export var cancelRequestAnimFrame:(handle:number)=>void = (function() {
        return window["cancelRequestAnimationFrame"] ||
        window["webkitCancelRequestAnimationFrame"] ||
        window["mozCancelRequestAnimationFrame"] ||
        window["oCancelRequestAnimationFrame"] ||
        window.clearTimeout;
    })();
}

