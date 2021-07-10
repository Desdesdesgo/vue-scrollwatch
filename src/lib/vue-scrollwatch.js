//   Scroll monitor component

import bezierEasing from 'bezier-easing'

const getOT = function (element) {
    let yPosition = 0
    let nextElement = element

    while (nextElement) {
      yPosition += (nextElement.offsetTop)
      nextElement = nextElement.offsetParent
    }
    return yPosition
}

let cubicBezierArray = [0.5, 0, 0.35, 1]
let blockWatch = false
let blockWatching = false
let currentNode = {}
let duration = 600
let nodeList = {}
let nodeTops = {}
let scrollAnimationFrame = null
let scrollDom = document.scrollingElement
let scrollTimer = null
let scrollTimerDelay = 150
let _db = function() {}
let _name ='vueScrollwatch'

const scrollDone = new Event('scroll_watch_done')

const handleScroll = function (scroll) {
  if (scrollTimer != null) {
    clearTimeout(scrollTimer)
  }
  scrollTimer = setTimeout(function() {
    let [new_current_node, tops] = get_current_node_and_tops()
    if (blockWatch) {
      blockWatch = false
    } else {
      dealResult(currentNode, new_current_node, tops)
    }
    currentNode.el = new_current_node.el
    currentNode.name = new_current_node.name
    currentNode.top = new_current_node.top
      _db(10, () => [_name, '#handleScroll', new_current_node.name, new_current_node.top])
    scrollDom.dispatchEvent(scrollDone)
  }, scrollTimerDelay)
}

const get_common_offset = function() {
  let first_node = nodeList[Object.keys(nodeList).sort()[0]]
  if (! first_node) return 0
  return first_node.top - scrollDomOT()
}

const get_current_node_and_tops = function() {
  let first_node = nodeList[Object.keys(nodeList).sort()[0]]
  try_update_node_tops(first_node,
                       Object.keys(nodeList).length != Object.keys(nodeTops).length)
  let tops = Object.keys(nodeTops).map(v => Number(v)).sort((a, b) => a - b)
  let last = tops.length - 1
  if (last <= 0) return

  // We assume that all nodes have the sam #offset.
  // Otherwise we have to use #offset in #find_current
  let threshold = Math.ceil(scrollDom.scrollTop + first_node.top + first_node.offset)
    _db(10, () => [_name, '#get_current_node_and_tops', scrollDom.scrollTop, first_node.top, first_node.offset, threshold])
  return [
    find_current(tops, threshold, 0, last),
    tops
  ]
}

const try_update_node_tops = function(node, force) {
  if (force == false || getOT(node.el) == node.top) return
    _db(10, () => [_name, '#try_update_node_tops', force || getOT(node.el) - node.top])
  nodeTops = {}
  for (let name in nodeList) {
    let node = nodeList[name]
    let nodeOT = getOT(node.el)
    if (nodeOT != node.top) node.top = nodeOT
    nodeTops[node.top] = node.name
  }
}

const find_current = function(tops, threshold, first, last) {
    _db(10, () => [_name, '#find_current', tops[first], tops[last], threshold, first, last])
  if (first == last) return nodeList[nodeTops[tops[first]]]
  let mid = Math.floor((first + last) / 2)
  if (tops[mid] <= threshold && tops[mid + 1] > threshold) {
      _db(10, () => [_name, '#find_current', tops[mid], mid])
    return nodeList[nodeTops[tops[mid]]]
  }
  if (tops[mid] <= threshold) {
    return find_current(tops, threshold, mid + 1, last)
  } else {
    return find_current(tops, threshold, first, mid - 1)
  }
}

const dealResult = function (startNode, endNode, tops) {
  let start = tops.indexOf(startNode.top)
  let end = tops.indexOf(endNode.top)
  if (start == end) return
  let step = start < end ? 1 : -1
  start += step
  for (; step > 0 ? start <= end : start >= end; start += step) {
    let node = nodeList[nodeTops[tops[start]]]
    if (node && node.callback)
        node.callback(node)
  }
}

const jumpTo = function (name) {
  if (blockWatching) blockWatch = true
  let target_node = nodeList[name]
  if (!target_node) return
  try_update_node_tops(target_node)
  moveTo(target_node.top - target_node.offset - scrollDomOT() - get_common_offset())
  currentNode.el = target_node.el
  currentNode.name = target_node.name
  currentNode.top = target_node.top
}

const scrollDomOT = function() {
  return getOT(scrollDom)
}

const scrollTo = function (name) {
  let promise = new Promise(function (resolve, reject) {
    if (blockWatching) blockWatch = true
    let target_node = nodeList[name]
    if (!target_node) {reject(name)}
    const startingY = scrollDom.scrollTop
    const difference = target_node.top - target_node.offset - get_common_offset()
                - scrollDomOT() - startingY
    try_update_node_tops(target_node)
    const easing = bezierEasing(...cubicBezierArray)
    let start = null
    const step = (timestamp) => {
        if (!start) start = timestamp
        let progress = timestamp - start >= duration ? duration
                                                     : (timestamp - start)
        let progressPercentage = progress / duration
        const perTick = startingY + (easing(progressPercentage) * difference)

        moveTo(perTick)

        if (progress < duration) {
          scrollAnimationFrame = window.requestAnimationFrame(step)
        } else {
          //jumpTo(name)
          resolve(target_node)
        }
    }
    window.requestAnimationFrame(step)
  })
  return promise
}

const moveTo = function(scrollTop){
    _db(10, () => [_name, '#moveTo', scrollTop])
  scrollDom.scrollTop = scrollTop
}

const updateNodeList = function(el, binding, vnode, fn) {
  if (Object.keys(nodeList).length == 0) {
      scrollDom.addEventListener('scroll', handleScroll)
  }

  let { name, offset=0, callback } = binding.value
  let top = getOT(el)
  el.attributes.name = name

  if (!currentNode.name) {
    currentNode.el = el
    currentNode.name = name
    currentNode.top = top
    currentNode.offset = offset
  }

  if (currentNode.name) {
    let current_name = get_current_node_and_tops()
    current_name = current_name && current_name[0].name
      _db(10, () => [_name, '#updateNodeList', current_name, currentNode.name])
    if (currentNode.name != current_name) jumpTo(currentNode.name)
  }

  if (name in nodeList) {
    delete nodeTops[nodeList[name].top]
  }
  nodeList[name] = { name, offset, top, el, callback }
  nodeTops[top] = name
    _db(10, () => [_name, '#updateNodeList', name, offset, top, getOT(el)])
}

const setBlockWatchOnJump = function(value) {
  blockWatching = !!value
}

const setContainer = function (css_selector) {
  scrollDom = document.querySelector(css_selector)
  if(!scrollDom){
    throw `[vue-scrollwatch] Element '${css_selector}' was not found.`
  }
}

const setScrollTimerDelay = function(delay){
  scrollTimerDelay = delay
}

let vueScrollwatch={}

vueScrollwatch.install = function (Vue) {
  Vue.directive('scrollWatch', {
    bind: function (el, binding, vnode) {
      if (typeof binding.value.db =='function') _db = binding.value.db
    },

    inserted: function (el, binding, vnode) {
      updateNodeList(el, binding, vnode, 'inserted')
    },

    unbind: function (el, binding, vnode) {
        _db(10, () => [_name, '#install:unbind', binding.value.name, nodeList[binding.value.name].top])
      delete nodeTops[nodeList[binding.value.name].top]
      delete nodeList[binding.value.name]
      if (Object.keys(nodeList).length == 0 && scrollDom) {
          scrollDom.removeEventListener('scroll', handleScroll)
          scrollDom = document.scrollingElement
      }

      // If it is animating, stop
      cancelAnimationFrame(scrollAnimationFrame)
    },

    update: function (el, binding, vnode) {
      updateNodeList(el, binding, vnode, 'update')
    },
  })
}

vueScrollwatch.currentNode = currentNode
vueScrollwatch.jumpTo = jumpTo
vueScrollwatch.scrollTo = scrollTo
vueScrollwatch.setBlockWatchOnJump = setBlockWatchOnJump
vueScrollwatch.setContainer = setContainer
vueScrollwatch.setScrollTimerDelay = setScrollTimerDelay

vueScrollwatch.nodeList = nodeList
vueScrollwatch.nodeTops = nodeTops
vueScrollwatch.moveTo = moveTo

export default vueScrollwatch
