
import bezierEasing from 'bezier-easing'

//   滚动监听组件

let nodeList = {}
let nodeTops = {}
let scrollDom = document.scrollingElement
let cubicBezierArray = [0.5, 0, 0.35, 1]
let duration = 600
let scrollAnimationFrame = null

const handleScroll = function () {
    let scrollTop = scrollDom.scrollTop
    let result = null
    if (Object.keys(nodeList).length != Object.keys(nodeTops).length) {
      nodeTops = {}
      for (let name in nodeList) {
        nodeTops[nodeList[name].top] = nodeList[name].name
      }
    }
    let tops = Object.keys(nodeTops).sort((a, b) => a - b)

    for (let top of tops) {
      let item = nodeList[nodeTops[top]]
      if (getOppositeOffsetToContainer(item.el) - item.offset <= scrollTop) {
        result = item
      }
    }
    dealResult(result)
}

const getOppositeOffsetToContainer = function (el) {
    return getOffsetTopByEl(el) - getOffsetTopByEl(scrollDom)
}

const getOffsetTopByEl = function (element) {
    let yPosition = 0
    let nextElement = element

    while (nextElement) {
        yPosition += (nextElement.offsetTop)
        nextElement = nextElement.offsetParent
    }
    return yPosition
}

const dealResult = function (result) {
    if (result && result.callback)
        result.callback(result)
}

const scrollTo = function (name) {
  let promise = new Promise(function (resolve, reject) {
    let target_node = nodeList[name]
    if (!target_node) {reject(name)}
    const startingY = scrollDom.scrollTop
    const difference = getOppositeOffsetToContainer(target_node.el) - startingY
    const easing = bezierEasing(...cubicBezierArray)
    let start = null
    const step = (timestamp) => {
        if (!start) start = timestamp
        let progress = timestamp - start >= duration ? duration : (timestamp - start)
        let progressPercentage = progress / duration
        const perTick = startingY + (easing(progressPercentage) * (difference - target_node.offset))

        moveTo(perTick)

        if (progress < duration) {
          scrollAnimationFrame = window.requestAnimationFrame(step)
        } else {
          resolve(target_node)
        }
    }
    window.requestAnimationFrame(step)
  })
  return promise
}

const moveTo = function(scrollTop){
    scrollDom.scrollTop = scrollTop
}

const setContainer = function (css_selector) {
  scrollDom = document.querySelector(css_selector)
  if(!scrollDom){
    throw `[vue-scrollwatch] Element '${css_selector}' was not found.`
  }
}

const updateNodeList = function(el, binding, vnode) {
  if (Object.keys(nodeList).length == 0) {
      scrollDom.addEventListener('scroll', handleScroll)
  }
  let { name, offset=0, callback } = binding.value
  el.attributes.name = name

  let top = el.offsetTop - offset
  if (name in nodeList) {
    delete nodeTops[nodeList[name].top]
  }
  nodeList[name] = { name, offset, top: top, el, callback }
  nodeTops[top] = name
}

let vueScrollwatch={}
vueScrollwatch.install = function (Vue) {
    Vue.directive('scrollWatch', {
        inserted: function (el, binding, vnode) {
          updateNodeList(el, binding, vnode)
        },

        unbind: function (el, binding, vnode) {
          delete nodeTops[nodeList[binding.value.name].top]
          delete nodeList[binding.value.name]
          if (Object.keys(nodeList).length == 0 && scrollDom) {
              scrollDom.removeEventListener('scroll', handleScroll)
              scrollDom = document.scrollingElement
          }

          // 如果正在动画，则停止
          cancelAnimationFrame(scrollAnimationFrame)
        },

        update: function (el, binding, vnode) {
          updateNodeList(el, binding, vnode)
        },
    })
}

vueScrollwatch.scrollTo=scrollTo
vueScrollwatch.setContainer=setContainer
export default vueScrollwatch
