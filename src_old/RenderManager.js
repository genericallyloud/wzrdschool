var WZRD = (function(WZRD){
    "use strict";
    
    function RenderManager(){

        var canvas = document.createElement("canvas");
        canvas.setAttribute("screencanvas", "1");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        var gl = getWebGLContext(canvas);
        if (!gl) { return; }

        // setup GLSL program
        var vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
        var fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
        var program = createProgram(gl, [vertexShader, fragmentShader]);
        gl.useProgram(program);

        // set the resolution
        var resolutionLocation = gl.getUniformLocation(program, "u_Resolution");
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        this.canvas = canvas;
        this.gl = gl;
    }


    RenderManager.prototype.draw = function draw(timestamp){
        if(gameState.xDiff !== 0){
            move(gameState.xDiff);
            //gameState.xDiff = 0;
        }
        var gl = gameState.gl,
        n = gameState.n;

        // Specify the color for clearing <canvas>
        gl.clearColor(0.9, 0.9, 1.0, 1.0);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw the rectangle
        gl.drawArrays(gl.TRIANGLES, 0, n);

        window.requestAnimFrame(draw);
    }

    function initVertexBuffers(gl, program, verticesColors, n) {

        // Create a buffer object
        var vertexColorBuffer = gl.createBuffer();
        if (!vertexColorBuffer) {
            console.log('Failed to create the buffer object');
            return false;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

        var FSIZE = verticesColors.BYTES_PER_ELEMENT;
        //Get the storage location of a_Position, assign and enable buffer
        var a_Position = gl.getAttribLocation(program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
        gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

        // Get the storage location of a_Position, assign buffer and enable
        var a_Color = gl.getAttribLocation(program, 'a_Color');
        if(a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
        gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object
    }

    
    WZRD.RenderManager = RenderManager;
}(WZRD || {}));