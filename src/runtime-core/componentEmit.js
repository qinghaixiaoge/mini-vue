
import { toHandlerKey,camelize } from "../shared/index.js"

export function emit(instance, event, ...args) {
    // console.log(instance, event); //add
    const { props } = instance
    // TPP 先写一个特定的行为 -> 重构成通用的行为
    const handlerName = toHandlerKey(camelize(event))
    const handler = props[handlerName]
    handler && handler(...args)
}