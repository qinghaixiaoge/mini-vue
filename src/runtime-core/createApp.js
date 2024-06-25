import { render } from "./renderer.js"
import { createVNode } from "./vnode.js"

export function createApp(rootComponent){
    return {
        mount: function(rootContainer){
            // const vnode = createVNode(document.querySelector(rootComponent))
            const vnode = createVNode(rootComponent)
            render(vnode,document.querySelector(rootContainer))
        }
    }
}

