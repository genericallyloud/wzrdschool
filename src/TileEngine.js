var WZRD = (function(WZRD){
    /**
     * Creates a new TileEngine which manages the tile data for rendering
     * 
     * @Constructor
     */
    function TileEngine(){
        var levelData = TileEngine.createLevelData(WZRD.levels.test.tileConfig);
        this.tileData = levelData[0];
        this.colOffsets = levelData[1];
        this.dataLength = levelData[2];
        this.colMax = this.colOffsets.length-31;
    }
    
    /**
     * Gets a view of the tile data (vertices/color data) based on the 
     *
     * @param start 0 based index
     */
    TileEngine.prototype.getColumnRange = function getColumnRange(start,count){
        var startIndex = this.colOffsets[start],
            endCol = start + count + 1; //this is one bigger because we want the exclusive index of the end
        //so if our count brings us to the edge of the level, just grab to the end of the buffer data
        var endIndex = endCol == this.colOffsets.length?this.dataLength+1:this.colOffsets[endCol];
        var floatCount = endIndex-startIndex;
        
        return [this.tileData.subarray(startIndex, endIndex), floatCount/5];
    };
    
    //=================================================
    //     Static Methods
    // mostly used internally, but testable this way
    //=================================================
    
    /**
     * 
     */
    TileEngine.loadTextureAtlas =function loadTextureAtlas(){
        
    };
    
    /**
     * Takes in the data from a level and produces a Float32Array from it containing
     * the pixel based offset vertices and 
     */
    TileEngine.parseLevel = function parseLevel(levelString){
        
    };
    
    var colors = [
        [0.459,0.376,0.09], //brown
        [0.137,0.619,0] //green
    ];
    /**
     * Takes a 2D array like the one created by parseLevel and produces a Float32Array
     * from it containing the pixel based offset vertices and texture coords. These
     * will be used to 
     */
    TileEngine.createLevelData = function createLevelData(tileConfig){
        var colNum,col,xCoord,tileNum,tileOffset,tileVal,color,
            width = tileConfig.length,
            height = tileConfig[0].length,
            //colCount x rowCount x verticesPerTile x floatsPerVertex
            //this array is over-allocated for the maximum possible amount. room for optimization
            buffer = new Float32Array(width * height * 6 * 5),
            bufferIndex = 0,
            colOffsets = [];
        for(colNum=0;colNum<width;colNum++){
            col = tileConfig[colNum];
            xCoord = colNum * 32;
            //maintain a index of where in the buffer each column starts
            colOffsets[colNum] = bufferIndex;
            for(tileNum=0;tileNum<height;tileNum++){
                tileVal = col[tileNum];
                //exit early if no tile here
                if(tileVal === 0) continue;
                
                //otherwise get color
                color = colors[tileVal-1];//-1 because 0 is not a color, so off by 1
                
                //delegate the vertex generation and update the bufferIndex
                bufferIndex = TileEngine._createTileVertices(
                                xCoord,tileNum * 32,width,height,color,buffer,bufferIndex);
                
            }
        }
        
        return [buffer,colOffsets,bufferIndex];
    };
    
    TileEngine._createTileVertices = function(x,y,width,height,color,buffer,bufferIndex){
        var bottom = y,
            top = y+32,
            left = x,
            right = x+32;
        
        // FIRST TRIANGLE
        
        //bottom left
        bufferIndex = TileEngine._createTileVertex(left,bottom,color,buffer,bufferIndex);
        //bottom right
        bufferIndex = TileEngine._createTileVertex(right,bottom,color,buffer,bufferIndex);
        //top left
        bufferIndex = TileEngine._createTileVertex(left,top,color,buffer,bufferIndex);
        
        //SECOND TRIANGLE
        
        //top left
        bufferIndex = TileEngine._createTileVertex(left,top,color,buffer,bufferIndex);
        //bottom right
        bufferIndex = TileEngine._createTileVertex(right,bottom,color,buffer,bufferIndex);
        //top right
        bufferIndex = TileEngine._createTileVertex(right,top,color,buffer,bufferIndex);
        
        return bufferIndex;
    };
    
    TileEngine._createTileVertex = function(x,y,color,buffer,bufferIndex){
        buffer.set([x,y,color[0],color[1],color[2]],bufferIndex);
        return bufferIndex+5;
    };
    
    WZRD.TileEngine = TileEngine;
}(WZRD || {}));