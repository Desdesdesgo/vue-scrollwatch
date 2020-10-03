//   Scroll monitor component

import bezierEasing from 'bezier-easing'

const getOffsetTop = function (element) {
    let yPosition = 0
    let nextElement = element

    while (nextElement) {
        yPosition += (nextElement.offsetTop)
        nextElement = nextElement.offsetParent
    }
    return yPosition
}

let nodeList = {}
let nodeTops = {}
let currentNode = {}
let scrollDom = document.scrollingElement
let scrollDomOffset = getOffsetTop(scrollDom)
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
    let last = tops.length - 1
    if (last <= 0) return

    result = find_current(tops, scrollTop + scrollDomOffset, 0, last)
    currentNode.el = result.el
    currentNode.name = result.name
    currentNode.top = result.top
    dealResult(result)
}

const find_current = function(tops, threshold, first, last) {
  let mid = Math.floor((first + last) / 2)
  let top = Number(tops[mid])
  if (top <= threshold && Number(tops[mid + 1]) > threshold) {
    return nodeList[nodeTops[tops[mid]]]
  }
  if (top <= threshold) {
    return find_current(tops, threshold, mid + 1, last)
  } else {
    return find_current(tops, threshold, first, mid - 1)
  }
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
    const difference =
        getOffsetTop(target_node.el) - scrollDomOffset - startingY
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
  scrollDomOffset = getOffsetTop(scrollDom)
}

const updateNodeList = function(el, binding, vnode) {
  if (Object.keys(nodeList).length == 0) {
      scrollDom.addEventListener('scroll', handleScroll)
  }

  let { name, offset=0, callback } = binding.value
  let top = el.offsetTop - offset
  el.attributes.name = name

  if (currentNode.name && currentNode.name == name) {
    scrollDom.scrollTop = scrollDom.scrollTop + top - currentNode.top
  }

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
              scrollDomOffset = getOffsetTop(scrollDom)
          }

          // If it is animating, stop
          cancelAnimationFrame(scrollAnimationFrame)
        },

        update: function (el, binding, vnode) {
          updateNodeList(el, binding, vnode)
        },
    })
}

vueScrollwatch.scrollTo = scrollTo
vueScrollwatch.setContainer = setContainer
vueScrollwatch.currentNode = currentNode
export default vueScrollwatch
