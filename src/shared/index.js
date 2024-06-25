export const extend = Object.assign

export const isObject = (raw) => {
    return raw !== null && typeof raw === "object"
}

export const hasChanged = (val, newValue) => {
    return !Object.is(val, newValue)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

// add-foo -> addFoo 烤肉串命名法转换为小驼峰命名格式
export const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        // console.log(_, c); // -f f
        return c ? c.toUpperCase() : ""
    })
}
// add -> Add  首字母转大写
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
// add -> onAdd  前缀拼接并将首字母转大写
export const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : ""
}