'use strict';

function initProps(instance, rawProps) {
  instance.props = rawProps || {};
}

const extend = Object.assign;
const isObject = raw => {
  return raw !== null && typeof raw === "object";
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

// add-foo -> addFoo 烤肉串命名法转换为小驼峰命名格式
const camelize = str => {
  return str.replace(/-(\w)/g, (_, c) => {
    // console.log(_, c); // -f f
    return c ? c.toUpperCase() : "";
  });
};
// add -> Add  首字母转大写
const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
// add -> onAdd  前缀拼接并将首字母转大写
const toHandlerKey = str => {
  return str ? "on" + capitalize(str) : "";
};

const publicPropertiesMap = {
  $el: i => i.vnode.el,
  $slots: i => i.slots
};
const PublicInstanceProxyHandlers = {
  get({
    _: instance
  }, key) {
    const {
      setupState,
      props
    } = instance;
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
    // if (key === "$el") {
    //     return instance.vnode.el
    // }
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
    // $data
  }
};

// const aa = {name:"xx"}
// const {name:xx} = aa
// console.log(xx);

const targetMap = new Map();
let activeEffect;
function trigger(target, key, value) {
  // console.log("trigger");
  let despMap = targetMap.get(target);
  let dep = despMap.get(key);
  triggerEffect(dep);
}
function triggerEffect(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      // effect.run()
      // 将要执行的函数和当前正在执行函数是同一个，跳过执行
      // console.log(activeEffect === effect);
      // https://zhuanlan.zhihu.com/p/694829454
      if (activeEffect !== effect) {
        effect.run();
      }
    }
  }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    }
    //TODO: 依赖收集
    // console.log("依赖收集");
    const res = Reflect.get(target, key);
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
function createSetter() {
  return function set(target, key, value) {
    //TODO：派发依赖
    // console.log("派发依赖");
    const res = Reflect.set(target, key, value);
    //去gie
    trigger(target, key);
    return res;
  };
}
const mutableHandlers = {
  get,
  set
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${key} set 失败 因为 target 是 readonly`, target);
    return true;
  }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});

function reactive(raw) {
  return createActiverawect(raw, mutableHandlers);
}
function readonly(raw) {
  return createActiverawect(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
  return createActiverawect(raw, shallowReadonlyHandlers);
}
function createActiverawect(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

function emit(instance, event, ...args) {
  // console.log(instance, event); //add
  const {
    props
  } = instance;
  // TPP 先写一个特定的行为 -> 重构成通用的行为
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}

const ShapeFlags = {
  ELEMENT: 1,
  // 0001
  STATEFUL_COMPONENT: 1 << 1,
  // 0010
  TEXT_CHILDREN: 1 << 2,
  // 0100
  ARRAY_CHILDREN: 1 << 3,
  // 1000
  SLOT_CHILDREN: 1 << 4 // 0001 0000
};

function initSlots(instance, children) {
  // 组件的children 只能是对象  
  // { default: (age)=>h("div",{},"插槽123") }
  const {
    vnode
  } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}
function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];
    slots[key] = props => normalizeSlotValue(value(props));
    // console.log(key,value,slots[key]("xx"));
  }
}
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: {},
    parent,
    emit: () => {}
  };
  component.emit = emit.bind(null, component);
  return component;
}
function setupComponent(instance) {
  // TODO
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  // 处理setup函数之后的返回值，初始化一个有状态的组件   （注意：函数组件没状态）
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const Component = instance.type;
  // ctx
  instance.proxy = new Proxy({
    _: instance
  }, PublicInstanceProxyHandlers);
  const {
    setup
  } = Component;
  if (setup) {
    // 返回function，代表是组件的render函数
    // 返回object，会把它注入到当前组件实例对象(也就是组件上下文)中
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult) {
  // 处理两种情况，分别是function和object，这边先处理是对象的情况
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  // 必须确保组件实例render是有值的
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  // 先判断当前组件实例上是否有render
  const Component = instance.type;
  // if (Component.render) {
  //     instance.render = Component.render
  // }
  instance.render = Component.render;
}
let currentInstance = null;
// 起到中间层的作用
function setCurrentInstance(instance) {
  currentInstance = instance;
}
function getCurrentInstance() {
  return currentInstance;
}

const Fragment = Symbol("Fragment");
const Text = Symbol("Text");
function createVNode(component, props, children) {
  // vnode类型分component和element
  const vnode = {
    type: component,
    props,
    children,
    shapeFlag: getShapeFlag(component),
    el: null
  };
  if (typeof vnode.children === "string") {
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN;
  } else {
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN;
  }
  // 是一个组件 并且children是object类型
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}
function getShapeFlag(type) {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
function createTextVNode(text) {
  return createVNode(Text, {}, text);
}

function render(vnode, container) {
  // 调用patch，为了方便后续进行递归的处理
  patch(vnode, container);
}
function patch(vnode, container) {
  // 判断vnode是component还是element
  // processElement()
  // console.log(vnode.type);
  const {
    shapeFlag,
    type
  } = vnode;
  switch (type) {
    case Fragment:
      // 只渲染children
      processFragment(vnode, container);
      break;
    case Text:
      // 渲染文本节点
      processText(vnode, container);
      break;
    default:
      // console.log(vnode);
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // console.log("processElement start",vnode.type);
        processElement(vnode, container);
        // console.log("processElement end",vnode.type);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // console.log("processComponent start");
        processComponent(vnode, container);
        // console.log("processComponent end");
      }
      // console.log(vnode);
      break;
  }
}
function processFragment(vnode, container) {
  mountChildren(vnode, container);
}
function processText(vnode, container) {
  const {
    children
  } = vnode;
  const textNode = document.createTextNode(children);
  vnode.el = textNode;
  container.append(textNode);
}
function processElement(vnode, container) {
  // 挂载element
  mountElement(vnode, container);
}
function mountElement(vnode, container) {
  const el = document.createElement(vnode.type);
  vnode.el = el;
  const {
    props,
    children,
    shapeFlag
  } = vnode;
  // console.log(vnode);
  for (const key in props) {
    let value = props[key];
    const isOn = key => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, value);
    } else {
      if (Array.isArray(value)) {
        value = value.join(" ");
      }
      el.setAttribute(key, value);
    }
  }
  // debugger;
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }
  container.append(el);
}
function mountChildren(vnode, container) {
  for (const v of vnode.children) {
    // console.log(v,v === "你好啊");
    patch(v, container);
  }
}
function processComponent(vnode, container) {
  // 挂载组件
  mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
  // 组件本身也有属性
  // 通过vnode创建组件实例对象，将props与slots挂载上去
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
  const {
    proxy
  } = instance;
  // console.log(instance,instance.render);
  const subTree = instance.render.call(proxy); // 返回虚拟节点数
  // vnode -> patch
  // vnode -> element -> mountelement
  // console.log("initpatch start");
  patch(subTree, container);
  // console.log("initpatch end");
  initialVNode.el = subTree.el;
  // console.log(vnode.el);
}

function createApp(rootComponent) {
  return {
    mount: function (rootContainer) {
      // const vnode = createVNode(document.querySelector(rootComponent))
      const vnode = createVNode(rootComponent);
      render(vnode, document.querySelector(rootContainer));
    }
  };
}

function h(type, props, children) {
  return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
  const slot = slots[name];
  // console.log(props,slot);
  if (slot) {
    if (typeof slot === "function") {
      // console.log(slot(props));
      // 因为是数组，所以使用div进行包裹
      // 处理方式，使用Fragment调用mountChildren直接渲染 slot(props)经过normalizeObjectSlots处理成数组了
      return createVNode(Fragment, {}, slot(props));
    }
  }
}

function provide(key, value) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const {
      provides
    } = currentInstance;
    provides[key] = value;
  }
}
function inject(key) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;
    return parentProvides[key];
  }
}

exports.createApp = createApp;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.renderSlots = renderSlots;
