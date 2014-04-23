///<reference path="levels/test.ts"/>
///<reference path="underscore.d.ts"/>
///<reference path="CollisionTile.ts"/>
module WZRD {
    export interface LevelChangeHandler {
        onLevelChange(colMax:number);
    }
    export interface LevelData {
        buffer:Float32Array;
        colOffsets:number[];
        bufferIndex:number;
        tiles:TileDef[][];
    }
    
    export class TileEngine {
        private tileData:Float32Array;
        private colOffsets:number[];
        private dataLength:number;
        private colMax:number;
        private camera:LevelChangeHandler;
        private tiles:TileDef[][];

        /**
         * Creates a new TileEngine which manages the tile data for rendering
         *
         * @Constructor
         */
        constructor(camera:LevelChangeHandler){
            this.camera = camera;
            var levelData = TileEngine.createLevelData(Levels.test.tileConfig);
            this.tileData = levelData.buffer;
            this.tiles = levelData.tiles;
            this.colOffsets = levelData.colOffsets;
            this.dataLength = levelData.bufferIndex;
            this.colMax = this.colOffsets.length-31;
            this.camera.onLevelChange(this.colMax);
        }

        /**
         * Gets a view of the tile data (vertices/color data) based on the
         *
         * @param start 0 based index
         */
        getColumnRangeBuffer(start,count){
            var startIndex = this.colOffsets[start],
            endCol = start + count + 1; //this is one bigger because we want the exclusive index of the end
            //so if our count brings us to the edge of the level, just grab to the end of the buffer data
            var endIndex = endCol == this.colOffsets.length?this.dataLength+1:this.colOffsets[endCol];
            var floatCount = endIndex-startIndex;

            return {buffer:this.tileData.subarray(startIndex, endIndex), vertexCount:floatCount/5};
        }
    
        getCollisionTilesForBounds(bounds:Bounds):CollisionTile[][]{
            var startCol = TileEngine.pixelToTile(bounds.getLeft()),
                endCol = TileEngine.pixelToTile(bounds.getRight()),
                startRow = TileEngine.pixelToTile(bounds.getBottom()),
                endRow = TileEngine.pixelToTile(bounds.getTop()),
                cols = [],
                c:number,
                r:number,
                currCol:CollisionTile[],
                currTileDef:TileDef;
            for(c=startCol;c<=endCol;c++){
                currCol = [];
                for(r=startRow;r<=endRow;r++){
                    currTileDef = this.tiles[c][r];
                    currCol.push(new BlockTile(currTileDef,c,r,TileEngine.TILE_SIZE));
                }
                cols.push(currCol);
            }
            return cols;
        }
                                                     
        //=================================================
        //     Static Methods
        // mostly used internally, but testable this way
        //=================================================
                
        static tileTypes:TileDef[] = [
            Object.freeze({
                name:"air",
                tileCollisionType:TileCollisionType.NONE
            }),
            Object.freeze({
                name:"dirt",
                tileCollisionType:TileCollisionType.BLOCK
            }),
            Object.freeze({
                name:"grass",
                tileCollisionType:TileCollisionType.BLOCK
            }),
            Object.freeze({
                name:"slope up",
                tileCollisionType:TileCollisionType.SLOPE,
                slope:(x)=>x
            }),
            Object.freeze({
                name:"slope down",
                tileCollisionType:TileCollisionType.SLOPE,
                slope:(x)=>TileEngine.TILE_SIZE-x
            })
        ];

        static pixelToTile(px:number){
            return px/TileEngine.TILE_SIZE | 0;
        }
        /**
         *
         */
        private static loadTextureAtlas(){}

        /**
         * Takes in the data from a level and produces a Float32Array from it containing
         * the pixel based offset vertices and
         */
        private static parseLevel(levelString){}

        private static colors = [
            [0.459,0.376,0.09], //brown
            [0.137,0.619,0] //green
        ];
    
        static TILE_SIZE = 32;

        /**
         * Takes a 2D array like the one created by parseLevel and produces a Float32Array
         * from it containing the pixel based offset vertices and colors (will be texture coords). These
         * will be sent to the shader to draw the tiles
         */
        static createLevelData(tileConfig):LevelData{
            var colNum,col,xCoord,tileNum,tileOffset,tileVal,color,
                width = tileConfig.length,
                height = tileConfig[0].length,
                //colCount x rowCount x verticesPerTile x floatsPerVertex
                //this array is over-allocated for the maximum possible amount. room for optimization
                buffer = new Float32Array(width * height * 6 * 5),
                bufferIndex = 0,
                colOffsets = [],
                tiles = [],
                tilesRow;
            
            for(colNum=0;colNum<width;colNum++){
                col = tileConfig[colNum];
                xCoord = colNum * 32;
                //maintain a index of where in the buffer each column starts
                colOffsets[colNum] = bufferIndex;
                tilesRow = [];
                tiles[colNum] = tilesRow;
                for(tileNum=0;tileNum<height;tileNum++){
                    tileVal = col[tileNum];
                    tilesRow[tileNum] = TileEngine.tileTypes[tileVal];
                    //exit early if no tile here
                    if(tileVal === 0) continue;

                    //otherwise get color
                    color = TileEngine.colors[tileVal-1];//-1 because 0 is not a color, so off by 1

                    //delegate the vertex generation and update the bufferIndex
                    bufferIndex = TileEngine.createTileVertices(
                    xCoord,tileNum * 32,width,height,color,buffer,bufferIndex);

                }
            }

            return {buffer:buffer,colOffsets:colOffsets,bufferIndex:bufferIndex,tiles:tiles};
        }

        static createTileVertices(x,y,width,height,color,buffer,bufferIndex){
            var bottom = y,
            top = y+32,
            left = x,
            right = x+32;

            // FIRST TRIANGLE

            //bottom left
            bufferIndex = TileEngine.createTileVertex(left,bottom,color,buffer,bufferIndex);
            //bottom right
            bufferIndex = TileEngine.createTileVertex(right,bottom,color,buffer,bufferIndex);
            //top left
            bufferIndex = TileEngine.createTileVertex(left,top,color,buffer,bufferIndex);

            //SECOND TRIANGLE

            //top left
            bufferIndex = TileEngine.createTileVertex(left,top,color,buffer,bufferIndex);
            //bottom right
            bufferIndex = TileEngine.createTileVertex(right,bottom,color,buffer,bufferIndex);
            //top right
            bufferIndex = TileEngine.createTileVertex(right,top,color,buffer,bufferIndex);

            return bufferIndex;
        }

        static createTileVertex(x,y,color,buffer,bufferIndex){
            buffer.set([x,y,color[0],color[1],color[2]],bufferIndex);
            return bufferIndex+5;
        }

    }
}