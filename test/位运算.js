const shapeFlags = 1 // 0001
console.log(shapeFlags << 1); // 0010
console.log(shapeFlags << 2); // 0100
console.log(shapeFlags << 3); // 1000

const aa = {
    name : "xx"
}
aa.__proto__.age = 18
console.log("age" in aa);
console.log(Object.prototype.hasOwnProperty.call(aa,"age")); // 不考虑原型链上的属性