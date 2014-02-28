module WZRD {

    export class Clock {
        private time;

        initTime(timestamp){
            this.time = timestamp;
        }

        updateTime(timestamp){
            var diff = timestamp - this.time;
            this.time = timestamp;
            return diff;
        }
    }
}