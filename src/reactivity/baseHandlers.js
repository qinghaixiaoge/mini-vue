import { extend, isObject } from "../shared/index.js"
import { track, trigger } from "./effect.js"
import { readonly, reactive } from "./reactive.js"
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === "__v_isReactive") {
            return !isReadonly
        } else if (key === "__v_isReadonly") {
            return isReadonly
        }
        //TODO: 依赖收集
        // console.log("依赖收集");
        const res = Reflect.get(target, key)
        if (!isReadonly) {  // 收集依赖必须在return前判断
            track(target, key)
        }
        if (shallow) {
            return res
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
        return res
    }
}
function createSetter() {
    return function set(target, key, value) {
        //TODO：派发依赖
        // console.log("派发依赖");
        const res = Reflect.set(target, key, value)
        //去gie
        trigger(target, key, value)
        return res
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key:${key} set 失败 因为 target 是 readonly`, target)
        return true
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})