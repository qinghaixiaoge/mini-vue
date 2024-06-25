import { initProps } from "./componentProps.js"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance.js"
import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit.js"
import { initSlots } from "./componentSlots.js"

export function createComponentInstance(vnode,parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: {},
        parent,
        emit: () => { }
    }
    component.emit = emit.bind(null, component)
    return component
}

export function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    // 处理setup函数之后的返回值，初始化一个有状态的组件   （注意：函数组件没状态）
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
    const Component = instance.type
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
    const { setup } = Component
    if (setup) {
        // 返回function，代表是组件的render函数
        // 返回object，会把它注入到当前组件实例对象(也就是组件上下文)中
        setCurrentInstance(instance)
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
        setCurrentInstance(null)
        handleSetupResult(instance, setupResult)
    }
}

function handleSetupResult(instance, setupResult) {
    // 处理两种情况，分别是function和object，这边先处理是对象的情况
    if (typeof setupResult === "object") {
        instance.setupState = setupResult
    }

    // 必须确保组件实例render是有值的
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    // 先判断当前组件实例上是否有render
    const Component = instance.type
    // if (Component.render) {
    //     instance.render = Component.render
    // }
    instance.render = Component.render
}

let currentInstance = null
// 起到中间层的作用
function setCurrentInstance(instance) {
    currentInstance = instance
}

export function getCurrentInstance() {
    return currentInstance
}