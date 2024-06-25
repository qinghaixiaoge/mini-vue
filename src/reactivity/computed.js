import { ReactiveEffect } from "./effect.js";

class ComputedRefImpl {
    _dirty = true
    _value;
    constructor(getter) {
        this._getter = getter
        this._effect = new ReactiveEffect(getter, () => {
            // console.log(11111);
            if (!this._dirty) {
                this._dirty = true
            }
        })
    }
    get value() {
        if (this._dirty) {
            this._value = this._effect.run()
            this._dirty = false
        }
        return this._value
    }
}

export function computed(getter) {
    return new ComputedRefImpl(getter)
}