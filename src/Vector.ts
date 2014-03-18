module WZRD {
    export class Vector {
        public x:number;
        public y:number;

        constructor(x,y){
            this.x = x;
            this.y = y;
        }
    
        copy(){
            return new Vector(this.x,this.y);
        }

        plus(v:Vector){
            return new Vector(this.x + v.x, this.y + v.y);
        }

        minus(v:Vector){
            return new Vector(this.x - v.x, this.y - v.y);
        }

        times(v:Vector){
            return new Vector(this.x * v.x, this.y * v.y);
        }

        timesNum(n:number){
            return new Vector(this.x * n, this.y * n);
        }
    }
}