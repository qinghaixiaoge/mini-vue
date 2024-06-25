import { h,renderSlots } from "../../lib/guide-mini-vue.esm.js"
import { getCurrentInstance } from "../../lib/guide-mini-vue.esm.js"
// 实现组件实例对象(组件上下文对象)props只读状态
// export const Foo = {
//     render() {
//         return h("div", {}, "foo：" + this.count)
//     },
//     setup(props) {
//         console.log(props);
//         props.count++
//         console.log(props);
//     }
// }

// 实现组件emit功能
// export const Foo = {
//     setup(props, { emit }) {
//         // console.log(props);
//         const emitAdd = () => {
//             console.log("emitAdd");
//             emit("add", 18)
//             emit("add-foo", 20)
//         }
//         return {
//             emitAdd
//         }
//     },
//     render() {
//         const btn = h("button", {
//             onClick: this.emitAdd
//         }, "emitAdd")
//         const foo = h("p", {}, "foo" + this.count)
//         return h("div", {}, [foo, btn])
//     },

// }

// 实现组件slots功能
// export const Foo = {
//     name: "Foo",
//     setup() {
//         console.log(getCurrentInstance());
//         return {}
//     },
//     render() {
//         // console.log(this.$slots.xiaoyu(18),this.$slots.xiaozhu(20),this.$slots,renderSlots(this.$slots.xiaoyu(18)));
//         // return h("div", {}, [this.$slots.xiaoyu(18), foo,this.$slots.xiaozhu(20)])
//         console.log(this.$slots);
//         const foo = h("p", {}, "foo")
//         return h("div",{},[renderSlots(this.$slots,"xiaoyu",{age:18}),foo,renderSlots(this.$slots,"xiaozhu",{age:20})])
//     }
// }