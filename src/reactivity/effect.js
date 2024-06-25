import { extend } from "../shared/index.js"
const targetMap = new Map()
let activeEffect;
let shouldTrack = true;
function track(target, key) {
    // console.log("track");
    if (!isTracking()) return; //优化点，成立则不需要在进行下面的操作
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    // console.log(activeEffect);
    trackEffect(dep)
    // console.log(activeEffect);
    // console.log(activeEffect.deps[0] === activeEffect.deps[1]);
}
export function trackEffect(dep){
    if (dep.has(activeEffect)) return; //避免重复收集同个依赖
    dep.add(activeEffect)
    activeEffect.deps.push(dep) // 使用push有个缺点，会重复收集dep，通过dep.has(activeEffect)解决
}
export function isTracking() {
    return shouldTrack && activeEffect !== undefined
}
function trigger(target, key, value) {
    // console.log("trigger");
    let despMap = targetMap.get(target)
    let dep = despMap.get(key)
    triggerEffect(dep)
}
export function triggerEffect(dep){
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            // effect.run()
            // 将要执行的函数和当前正在执行函数是同一个，跳过执行
            // console.log(activeEffect === effect);
            // https://zhuanlan.zhihu.com/p/694829454
            if (activeEffect !== effect) {
                effect.run()
            }
        }
    }
}

export class ReactiveEffect {
    deps = []
    active = true
    onStop = null
    constructor(fn, scheduler) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        // console.log("run start");
        if (!this.active) {
            return this._fn()
        }
        activeEffect = this
        shouldTrack = true
        const res = this._fn() // 通过调用track开始收集依赖
        // console.log("run end");
        shouldTrack = false
        activeEffect = undefined  // 置为undefined，是为了避免触发依赖时，进入无限递归
        return res
    }
    stop() {
        if (this.active) {
            clearupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}
function effect(fn, options = {}) {
    const scheduler = options.scheduler
    const _effect = new ReactiveEffect(fn, scheduler)
    extend(_effect, options)
    _effect.run()
    const runner = _effect.run.bind(_effect)
    runner.effect = _effect // 用来取消收集的依赖，stop，activeEffect即_effect
    return runner
}

function stop(runner) {
    runner.effect.stop()
}

function clearupEffect(effect) {
    effect.deps.forEach(dep => {
        dep.delete(effect)
    })
    effect.deps.length = 0 // 目前只有一个依赖函数，直接清空就行
}
export { effect, track, trigger, stop }
