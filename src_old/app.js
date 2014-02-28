

window.onload = main;

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


