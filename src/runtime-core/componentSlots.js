import { ShapeFlags } from "./ShapeFlags.js"

export function initSlots(instance, children) {
    // 组件的children 只能是对象  
    // { default: (age)=>h("div",{},"插槽123") }
    const {vnode} = instance
    if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(children, instance.slots)
    }
}

function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key]
        slots[key] = (props) => normalizeSlotValue(value(props))
        // console.log(key,value,slots[key]("xx"));
    }
}

function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}