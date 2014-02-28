module WZRD {
//    class MessageBus {
//        private tileEngineChannel:Channel<TileEngine>;
//
//        constructor(){
//            this.tileEngineChannel = new Channel<TileEngine>();
//        }
//    }
//
//    class Channel<T>{
//        private listeners:Listener<T>[];
//        constructor(){
//            this.listeners = [];
//        }
//        listen(listener:Listener<T>){
//            this.listeners.push(listener);
//        }
//        trigger(data:T){
//            var i:number, l:number;
//            for(i = 0, l=this.listeners.length; i<l; i++){
//                this.listeners[i](data);
//            }
//        }
//    }
//
//    interface Listener<T> {
//        (data:T):void;
//    }
}