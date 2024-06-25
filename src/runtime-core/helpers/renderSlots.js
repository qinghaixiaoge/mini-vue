import { Fragment, createVNode } from "../vnode.js"
export function renderSlots(slots, name, props) {
    const slot = slots[name]
    // console.log(props,slot);
    if (slot) {
        if (typeof slot === "function") {
            // console.log(slot(props));
            // 因为是数组，所以使用div进行包裹
            // 处理方式，使用Fragment调用mountChildren直接渲染 slot(props)经过normalizeObjectSlots处理成数组了
            return createVNode(Fragment, {}, slot(props))
        }
    }
}