import { reactive, readonly, isReactive, isReadonly, shallowReadonly, isProxy } from "../src/reactivity/reactive.js"
import { effect, stop } from "../src/reactivity/effect.js"
import { isRef, proxyRefs, ref, unRef } from "../src/reactivity/ref.js";
import { computed } from "../src/reactivity/computed.js";
// let user = reactive({ age: 10 });
// let nextAge;
// let run;
// const scheduler = () => {
//     run = runner
// }
// 06-实现effect & reactive & 依赖收集 & 触发依赖
// const runner = effect(() => {
//     nextAge = user.age + 1
// })
// console.log(nextAge);
// user.age++ //依赖收集 依赖收集 触发依赖 依赖收集
// console.log(nextAge);


// 07-实现effect返回runner
// let foo = 10
// const runner = effect(() => {
//     foo++
//     return 1
// })
// console.log(foo);
// const result = runner()
// console.log(foo);
// console.log(result);

// 08-实现effect.scheduler功能
// const runner = effect(() => {
//     nextAge = user.age + 1
// },{scheduler})
// console.log(nextAge);
// user.age++ //依赖收集 依赖收集 触发依赖 依赖收集
// run && run()
// console.log(nextAge);

// 09-实现effect的stop功能
// let dummy;
// function onStop(){
//     console.log("执行onstop回调");
// }
// const obj = reactive({ prop: 1 })
// const runner = effect(() => {
//     dummy = obj.prop
// },{
//     onStop
// })
// obj.prop = 2
// console.log(dummy);
// stop(runner)
// obj.prop = 3
// runner()
// console.log(dummy);
// console.log(runner.effect);

// 10-实现readonly功能
// const original = {foo:1,bar:{baz:2}}
// const wrapped = readonly(original)
// wrapped.foo = 2

// 11-实现isReactive和isReadonly
// const original = {foo:1}
// const observed = reactive(original)
// console.log(isReadonly(observed));
// console.log(isReactive(observed));

// 12-优化stop功能
// let dummy;
// const obj = reactive({ prop: 1 })
// const runner = effect(() => {
//     dummy = obj.prop
// })
// obj.prop = 2
// console.log(dummy);
// stop(runner)
// obj.prop++
// runner()
// console.log(dummy);

// 13-实现reactive和readonly嵌套对象转换功能
// const original = {
//     nested: {
//         foo:1
//     },
//     array:[{bar:2}]
// }
// const observed = reactive(original)
// console.log(isReactive(observed.nested));
// console.log(isReactive(observed.array));
// console.log(isReactive(observed.array[0]));

// const original = {foo:1,bar:{baz:2}}
// const wrapped = readonly(original)
// console.log(isReadonly(wrapped));
// console.log(isReadonly(original));
// console.log(isReadonly(wrapped.bar));
// console.log(isReadonly(original.bar));

// 14-实现shallowReadonly功能
// const props = shallowReadonly({ n: { foo: 1 } })
// console.log(isReadonly(props));
// console.log(isReadonly(props.n));
// props.n.foo = 5
// console.log(props);

// 15-实现isProxy功能
// const original = {foo:1,bar:{baz:2}}
// const wrapped = readonly(original)
// const observed = reactive(original)
// const props = shallowReadonly(original)
// console.log(isProxy(wrapped.bar));
// console.log(isProxy(observed.bar));
// console.log(isProxy(props.bar));

// 16-实现ref功能
// const a = ref(1)
// console.log(a.value);

// const a = ref(1)
// let dummy;
// let calls = 0;
// effect(()=>{
//     calls++
//     dummy = a.value
// })
// a.value = 2
// console.log(calls);
// a.value = 2
// console.log(calls);

// const a = ref({
//     count:1
// })  
// let dummy;
// effect(()=>{
//     dummy = a.value.count
// })
// console.log(dummy);
// a.value.count = 2
// console.log(dummy);

// 17-实现isRef 和 unRef 功能
// const a = ref(1);
// const user = reactive({
//     age:1
// })
// console.log(isRef(a));
// console.log(isRef(1));
// console.log(isRef(user))

// const a = ref(1);
// console.log(unRef(a));
// console.log(unRef(1));

// 18-实现 proxyRefs 功能
// const user = {
//     age: ref(10),
//     name: "xiaohong"
// }
// const proxyUser = proxyRefs(user)
// console.log(user.age.value);
// console.log(proxyUser.age);
// console.log(proxyUser.name);

// proxyUser.age = 20
// console.log(proxyUser.age);
// console.log(user.age.value);

// proxyUser.age = ref(10)
// console.log(proxyUser.age);
// console.log(user.age.value);

// 19-实现 computed 计算属性
// const user = reactive({
//     age: 1
// })
// const age = computed(()=>{
//     return user.age
// })
// console.log(age.value);

// const value = reactive({
//     foo: 1
// })
// const cValue = computed(()=>{
//     return value.foo
// })
// console.log(cValue.value);
// value.foo = 2
// console.log(cValue.value);


// 注意：触发依赖的时候会导致栈溢出
// vue3的effect如何避免自增进入死循环
// const count = ref(1)    
// effect(()=>{
//     count.value++
//     console.log(66666);
// })
// console.log(count.value);
// count.value++
// console.log(count.value);

const obj = reactive({
    count: 1
})
effect(()=>{
    obj.count++
})
console.log(obj.count);
obj.count++
console.log(obj.count);
