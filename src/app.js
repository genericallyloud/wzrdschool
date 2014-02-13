

window.onload = main;
document.onkeydown = onkey;
document.onkeyup = offkey;

function onkey(e) {

    if (e.keyCode == '37') {
        // left arrow
        gameState.xDiff = -10;
    }
    else if (e.keyCode == '39') {
        // right arrow
        gameState.xDiff = 10;
    }
    e.preventDefault();
}
function offkey(e) {
    gameState.xDiff = 0;
    e.preventDefault();
}

var gameState;

function main() {
    
    // Get A WebGL context
    var canvas = document.getElementById("canvas");
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
    
    gameState = {
        gl: gl,
        program: program,
        tileEngine: new TileEngine(),
        player: new Player(),
        position: [16,16],
        colStart:0,
        colMax: tileEngine.colMax,
        xDiff:0
    };
    
    //initialize columns
    updateColumns(0);
    updatePosition();
    window.requestAnimFrame(draw);
}

function updateColumns(start){
    var columnRange = gameState.tileEngine.getColumnRange(start,30);
    var verticesColors = columnRange[0];
    var n = columnRange[1];
    
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }
    
    gameState.verticesColors = verticesColors;
    gameState.n = n;
    
    // Set vertex information
    initVertexBuffers(gameState.gl, gameState.program, verticesColors, n);
}

function move(xDiff){
    var position = gameState.position;
    var newX = position[0] + xDiff;
    if(newX < 0) return;
    position[0] = newX;
    var colStart = gameState.colStart;
    var col = (newX/32 | 0);
    if(col !== colStart){
        if(col > gameState.colMax) return;
        gameState.colStart = col;
        updateColumns(col);
    }
    updatePosition();
}

function updatePosition(){
    // set the resolution
    var translationAmount = gameState.gl.getUniformLocation(gameState.program, "u_Translation"),
        position = gameState.position;
    gameState.gl.uniform2f(translationAmount, position[0], position[1]);
}

function draw(timestamp){
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

