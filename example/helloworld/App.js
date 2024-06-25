import { h, createTextVNode, getCurrentInstance, provide, inject } from "../../lib/guide-mini-vue.esm.js"
// import { Foo } from "./Foo.js";
// 实现组件emit功能
// export default {
//     render() {
//         window.self = this;
//         // console.log("组件全部渲染完毕才会有$el",this.$el);
//         // return h("div", { class: "box" }, "hi，" + this.msg)
//         return h(
//             "div",
//             {
//                 class: ["box", "aaa"],
//                 onClick() {
//                     // console.log(6666);
//                 }
//             },
//             [h("h1", { class: "red" }, "123"),
//             h("h2", { class: "green" }, this.msg),
//             h(Foo, {
//                 count: 1,
//                 // add -> Add
//                 onAdd(age) {
//                     console.log("onAdd", age);
//                 },
//                 // add-foo -> AddFoo
//                 onAddFoo(age) {
//                     console.log("onAddFoo", age);
//                 }
//             })])
//     },
//     setup() {
//         return {
//             msg: "mini-vue"
//         }
//     },
// }




// 实现组件slots功能
// export default {
//     name: "App",
//     render() {
//         const app = h("div", {}, "App")
//         const foo = h(Foo, {}, {
//             xiaoyu: ({ age }) => [
//                 h("p", {}, "123插槽" + age),
//                 createTextVNode("你好呀")
//             ],
//             xiaozhu: ({ age }) => h("p", {}, "456插槽" + age)
//         })
//         // const foo = h(Foo, {}, [h("p", {}, "123插槽"), h("p", {}, "456插槽")]) // h("p", {}, "123") 作为返回值添加到Foo的children里  渲染组件是不会进入mountChildren函数的
//         return h("div", {}, [app, foo, createTextVNode("你好呀")])
//     },
//     setup() {
//         console.log(getCurrentInstance());
//         return {}
//     },
// }

// 组件 provide 和 inject 功能
const Provider = {
    name: "Provider",
    setup() {
        provide("foo", "fooVal")
        provide("bar", "barVal")
    },
    render() {
        return h("div", {}, [h("p", {}, "Provider"), h(Consumer)])
    }
}

const Consumer = {
    name: "Consumer",
    setup() {
        const foo = inject("foo")
        const bar = inject("bar")
        return {
            foo,
            bar
        }
    },
    render() {
        return h("div", {}, `Consumer: - ${this.foo} - ${this.bar}`)
    }
}

export default {
    name: "App",
    setup() { },
    render() {
        return h("div", {}, [h("p", {}, "apiInject"), h(Provider)])
    }
}