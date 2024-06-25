import { createComponentInstance, setupComponent } from "./component.js"
import { ShapeFlags } from "./ShapeFlags.js"
import { Fragment, Text } from "./vnode.js"

export function render(vnode, container) {
    // 调用patch，为了方便后续进行递归的处理
    patch(vnode, container)
}

export function patch(vnode, container) {
    // 判断vnode是component还是element
    // processElement()
    // console.log(vnode.type);
    const { shapeFlag, type } = vnode
    switch (type) {
        case Fragment:
            // 只渲染children
            processFragment(vnode, container)
            break;
        case Text:
            // 渲染文本节点
            processText(vnode, container)
            break;
        default:
            // console.log(vnode);
            if (shapeFlag & ShapeFlags.ELEMENT) {
                // console.log("processElement start",vnode.type);
                processElement(vnode, container)
                // console.log("processElement end",vnode.type);
            } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                // console.log("processComponent start");
                processComponent(vnode, container)
                // console.log("processComponent end");
            }
            // console.log(vnode);
            break;
    }
}

function processFragment(vnode, container) {
    mountChildren(vnode, container)
}

function processText(vnode, container) {
    const { children } = vnode
    const textNode = document.createTextNode(children)
    vnode.el = textNode
    container.append(textNode)
}

function processElement(vnode, container) {
    // 挂载element
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const el = document.createElement(vnode.type)
    vnode.el = el
    const { props, children, shapeFlag } = vnode
    // console.log(vnode);
    for (const key in props) {
        let value = props[key]
        const isOn = (key) => /^on[A-Z]/.test(key)
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase()
            el.addEventListener(event, value)
        } else {
            if (Array.isArray(value)) {
                value = value.join(" ")
            }
            el.setAttribute(key, value)
        }
    }
    // debugger;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }
    container.append(el)
}

function mountChildren(vnode, container) {
    for (const v of vnode.children) {
        // console.log(v,v === "你好啊");
        patch(v, container)
    }
}

function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container)
}

function mountComponent(initialVNode, container) {
    // 组件本身也有属性
    // 通过vnode创建组件实例对象，将props与slots挂载上去
    const instance = createComponentInstance(initialVNode)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)

}

function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance
    // console.log(instance,instance.render);
    const subTree = instance.render.call(proxy) // 返回虚拟节点数
    // vnode -> patch
    // vnode -> element -> mountelement
    // console.log("initpatch start");
    patch(subTree, container)
    // console.log("initpatch end");
    initialVNode.el = subTree.el
    // console.log(vnode.el);
}