/**
 * Created by Liu.Jun on 2017/2/20.
 */

function Point(x, y) {
    this.x =  x;
    this.y = y;
}

Point.prototype = {
    toString(){
        return `${this.x}${this.y}`
    }
}

let pointX = new Point(1,2);
// console.log(pointX.toString());

// -------------------------------------------

function Person(name, age) {
    let o = new Object();
    o.name = name;
    o.age = age;
    o.getName = function () {
        alert(this.name);
    }

    return o;
}

let person1 = new Person('liujun',19);
// alert(person1.name);

let person2 = Person('liujun2',19);
// alert(person2.name);

// -------------------------------------------
class User {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    toString(){
        return `${this.x}${this.y}`
    }
}

console.log(typeof User);
console.log(User === User.prototype.constructor)

let liu = new User('liu','jun');
console.log(liu.toString());

liu.hasOwnProperty('constructor')


class MyUser extends User{
    constructor(x,y,color){
        super(x,y); // super 调用父类的 constructor 方法
        this.color = color;
    }
    toString(){
        return `name ${this.x}${this.y} color${this.color}`
    }
}

let user = new MyUser('liu','jun','yellow');
console.log(user.toString());
