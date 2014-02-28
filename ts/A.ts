///<reference path="C.ts"/>
module WZRD {
    export class A extends C {
        age:number;
        constructor(name:string, age:number){
            super(name);
            this.age = age;
        }
    }
}