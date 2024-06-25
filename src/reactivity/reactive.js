import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers.js"
const ReactiveFlags = {
    IS_REACTIVE: "__v_isReactive",
    IS_READONLY: "__v_isReadonly"
}
function reactive(raw) {
    return createActiverawect(raw, mutableHandlers)
}
function readonly(raw) {
    return createActiverawect(raw, readonlyHandlers)
}
function shallowReadonly(raw) {
    return createActiverawect(raw, shallowReadonlyHandlers)
}
function createActiverawect(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}
function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}
function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value)
}
export { reactive, readonly, isReactive, isReadonly, shallowReadonly, isProxy }