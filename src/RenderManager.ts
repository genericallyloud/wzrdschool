///<reference path="Camera.ts"/>
///<reference path="StateManager.ts"/>
///<reference path="TileEngine.ts"/>
///<reference path="webgl.d.ts"/>
module WZRD {
    /**
     * RenderManager is meant to isolate the gl operations, although there are lower things
     * which just might need stuff...
     */
    export class RenderManager {
        private canvas:HTMLCanvasElement;
        private gl:WebGLRenderingContext;
        private program:WebGLProgram;
        private camera:Camera;
        private tileEngine:TileEngine;
        private stateManager:StateManager;

        constructor(camera, tileEngine, stateManager){
            this.camera = camera;
            this.tileEngine = tileEngine;
            this.stateManager = stateManager;
        
            var canvas = document.createElement("canvas");
            canvas.setAttribute("screencanvas", "1");
            this.updateSize(canvas);
            document.body.appendChild(canvas);

            window.addEventListener("resize", (event)=>this.updateSize(canvas));

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

            this.canvas = gl.canvas;
            this.gl = gl;
            this.program = program;
        }

        draw(){
            var gl = this.gl;
            // Specify the color for clearing <canvas>
            gl.clearColor(0.9, 0.9, 1.0, 1.0);

            // Clear <canvas>
            gl.clear(gl.COLOR_BUFFER_BIT);
            this.drawTileLayer();
            this.drawSprites();
        }

        private updateSize(canvas){
            var width = window.innerWidth,
                height = window.innerHeight
            canvas.width = width;
            canvas.height = height;

            //do some math to update how big the canvas is for the camera
            this.camera.onResize(width,height);
        }

        private drawTileLayer(){
            var colStartWidth = this.camera.getColumnStartWidth();
            var columnRange = this.tileEngine.getColumnRangeBuffer(colStartWidth.start,colStartWidth.width);
            var verticesColors:Float32Array = columnRange.buffer;
            var n:number = columnRange.vertexCount;

            if (n < 0) {
                console.log('Failed to set the vertex information');
                return;
            }

            var gl = this.gl;

            // Set vertex information
            this.initVertexBuffers(gl, this.program, verticesColors, n);

            // Draw the rectangle
            gl.drawArrays(gl.TRIANGLES, 0, n);
        }

        private drawSprites(){
            var vertices = this.stateManager.getSpriteVertices();
            var verticesColors:Float32Array = vertices.buffer;
            var n:number = vertices.vertexCount;

            if (n < 0) {
                console.log('Failed to set the vertex information');
                return;
            }

            var gl = this.gl;

            // Set vertex information
            this.initVertexBuffers(gl, this.program, verticesColors, n);

            // Draw the rectangle
            gl.drawArrays(gl.TRIANGLES, 0, n);
        }


        private updatePosition(){
            // set the resolution
            var translationAmount = this.gl.getUniformLocation(this.program, "u_Translation");
            var startWidth = this.camera.getColumnStartWidth();
            this.gl.uniform2f(translationAmount, startWidth.start, startWidth.width);
        }

        private initVertexBuffers(gl, program, verticesColors:Float32Array, n) {

            // Create a buffer object
            var vertexColorBuffer = gl.createBuffer();
            if (!vertexColorBuffer) {
                console.log('Failed to create the buffer object');
                return;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

            var FSIZE = verticesColors.BYTES_PER_ELEMENT;
            //Get the storage location of a_Position, assign and enable buffer
            var a_Position = gl.getAttribLocation(program, 'a_Position');
            if (a_Position < 0) {
                console.log('Failed to get the storage location of a_Position');
                return;
            }
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
            gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

            // Get the storage location of a_Position, assign buffer and enable
            var a_Color = gl.getAttribLocation(program, 'a_Color');
            if(a_Color < 0) {
                console.log('Failed to get the storage location of a_Color');
                return;
            }
            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
            gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object
        }
    }
}

