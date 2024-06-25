import { hasChanged, isObject } from "../shared/index.js"
import { isTracking, trackEffect, triggerEffect } from "./effect.js"
import { reactive } from "./reactive.js";

class RefImpl {
    dep;
    __v_isRef = true;
    constructor(value) {
        this._rawValue = value
        this._value = convert(value)
        this.dep = new Set()
    }
    get value() {
        trackRefValue(this)
        // console.log(this.dep);
        return this._value
    }
    set value(newValue) {
        if (hasChanged(this._rawValue, newValue)) {
            this._rawValue = newValue
            this._value = convert(newValue)
            triggerEffect(this.dep)
            // console.log(this.dep);
        }
    }
}

function trackRefValue(ref) {
    if (isTracking()) {
        trackEffect(ref.dep)
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value
}

export function ref(value) {
    return new RefImpl(value)
}

export function isRef(ref){
    return !!ref.__v_isRef
}

export function unRef(ref){
    return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectwithRefs){
    return new Proxy(objectwithRefs,{
        get(target,key){
            return unRef(Reflect.get(target,key))
        },
        set(target,key,value){
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value)
            }else{
                return Reflect.set(target,key,value)
            }
        }
    })
}
