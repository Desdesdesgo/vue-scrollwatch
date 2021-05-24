# vue-scrollwatch

> scrollwatch
features：
- auto detect element enter viewpoint when scroll
- expose api: scrollTo , to scroll element to enter viewpoint and others
- you can set scroll container, not just window
- use vue directive
- no limitation of nav list


特性：
- 滚动时判断出窗口中当前元素
- 暴露api scrollTo  自由指定要滚到的位置
- 滚动容器自由指定，不局限于window
- vue 指令的方式
- 导航列表没有任何限制
- 您可以使用带有布尔参数的setBlockWatchOnJump函数阻止在scrollTo期间调用回调


[click to demo](https://Desdesdesgo.github.io/vue-scrollwatch/)

 learning usage from src/views/page1.vue and page2.vue
 查看源码中的src/views/page1.vue and page2.vue 获得详细使用方式
## Installation

```bash
npm install --save vue-scrollwatch
```
or
```bash
yarn add vue-scrollwatch
```

in `main.js`
```js
import vueScrollwatch from "vue-scrollwatch"
Vue.use(vueScrollwatch)
```

## Usage
 导航
 nav
```html
<ul>
    <li @click="scrollTo('a')">section 1</li>
    <li @click="scrollTo('b')">section 2</li>
    <li @click="scrollTo('c')">section 3</li>
    <li @click="scrollTo('d')">section 4</li>
</ul>

```

element to watch

```html
 <div class="section" v-scrollWatch="{name:'a',offset:0,callback:spyDomChange}">scetcion 1</div>
<div class="section" v-scrollWatch="{name:'b',offset:0,callback:spyDomChange}">scetcion 2</div>
<div class="section" v-scrollWatch="{name:'c',offset:0,callback:spyDomChange}">scetcion 3</div>
<div class="section" v-scrollWatch="{name:'d',offset:0,callback:spyDomChange}">scetcion 4</div>

```

`callback` and `scrollTo` in methods
```js
import scrollWatch from "vue-scrollwatch"
export default {
    ...
    methods:{
        spyDomChange(node) {
            if (this.activeMenu != node.name)
                this.activeMenu = node.name
        },
        scrollTo(name){
            scrollWatch.scrollTo(name)
        }
    }
    ...
}

```

You can also use `scrollTo` as a promise:
```
  this.$root.vueScrollwatch.scrollTo(name)
    .then(success_function(node))
    .catch(report_unknown_name(name))
```

 if you want to define a container to scroll (not window)
 如果你想指定滚动容器，而不是window

```html
<div id="scrollDom">
    <div class="section" v-scrollWatch="{name:'a',offset:0,callback:spyDomChange}">scetcion 1</div>
    <div class="section" v-scrollWatch="{name:'b',offset:0,callback:spyDomChange}">scetcion 2</div>
    <div class="section" v-scrollWatch="{name:'c',offset:0,callback:spyDomChange}">scetcion 3</div>
    <div class="section" v-scrollWatch="{name:'d',offset:0,callback:spyDomChange}">scetcion 4</div>
<div>
```


```js
import scrollWatch from "vue-scrollwatch"
export default {
    ...
    created(){
        scrollWatch.setContainer("#scrollDom")
        scrollWatch.setBlockWatchOnJump(true)
    }
    ...
}
```
 you also can use class as selector
 你也可以使用 class 来作为css 选择器

 container and element to be watch hasn't to be father and sons,it also can be grandfather or grand-grandfather
 滚动容器和监听元素之间不一定是父子关系,可以是爷孙关系，也可以是祖宗孙子关系


## Options

#### name
*required:* `true`

#### offset
元素位置偏移
*default:* `0`

#### callback
*type:* `function`

## dev example
``` js
 npm run dev
```

## API

### currentNode()

Returns an Object with the information about the last element passed the
viewpoint during the scroll. It has the following properties:

- el: the element itself
- name: the `name` options assigned to the element
- top: el.offsetTop minus `offset` assigned to the element

### jumpTo(name)

Exposed the element that has the option `name` equal to the given `name`
at the viewpoint without scrolling.

### scrollTo(name)

Scrolls the content to expose the element that has the option `name`
equal to the given `name` at the viewpoint. Returns a promise.

### setAdjustPositionAfterInsertion(value)

If you insert any elements above `currentNode().el` it will move down
and may even disappear below the bottom of the scrolling area observed.
But the library is aware of this situation and automatically adjusts
the scrolling position so that visible elements do not move.

But when the element with `v-scroll-watch` directive is not a standard
html element but **Vue.js** *component*, this adjustment is not
required as **Vue.js** makes it self.

So, in the latter case you should call this function with `true` to
disable the unneeded correction.

### setBlockWatchOnJump(value)

In some cases you could not want the `callback`s to be done while
`scrollTo` is executed. Then pass the value `true`. By default the
the value is `false` and the callbacks are not blocked and are acitvated.

### setContainer(css_selector)

By default the scrollWatch operates on the whole document. That means
`document.scrollingElement` is used that usually is `<html>`.
Call to this function assigns the functionality to the first
element of DOM, that conforms to the `css_selector`.

### setScrollTimerDelay(µs)

Scrolling generates a lot of events. If every event will cause the
corresponding the `callback`, it will significantly slow down
the whole application.

To avoid this situation the timeout was introduced. All the elements
that have passed through the defined viewpoint will receive only one
callback after the defined timeout since the scrolling stopped.

By default is is 150µs. You can change the value via this call.

## Thanks
[vue-scrollactive](https://github.com/eddiemf/vue-scrollactive.git)
