import { ShapeFlags } from "./ShapeFlags.js"
export const Fragment = Symbol("Fragment")
export const Text = Symbol("Text")
export function createVNode(component, props, children) {
    // vnode类型分component和element
    const vnode = {
        type: component,
        props,
        children,
        shapeFlag: getShapeFlag(component),
        el: null
    }
    if (typeof vnode.children === "string") {
        vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
    } else {
        vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN
    }
    // 是一个组件 并且children是object类型
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if (typeof children === "object") {
            vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOT_CHILDREN
        }
    }
    return vnode
}

function getShapeFlag(type) {
    return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}

export function createTextVNode(text) {
    return createVNode(Text, {}, text)
}