
let obj = {name:"xx"}
let set = new Set([obj])
const map = new Map([["XX",set]])
const arr = []
arr.push(set)
console.log(set);
console.log(map);
console.log(arr);
set.delete(obj)
console.log(set);
console.log(map);
console.log(arr);
set.add(obj)
arr.push(set)
console.log(arr);
// 数组存储的是常量
// const arr = [obj]
// obj = 1
// console.log(arr);