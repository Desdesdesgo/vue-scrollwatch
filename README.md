# vue-scrollwatch

> scrollwatch

特性：
- 滚动时判断出窗口中当前元素
- 暴露api scrollTo  自由指定要滚到的位置
- 滚动容器自由指定，不局限于window
- vue 指令的方式
- 监听元素没有任何限制，无需使用id 或者 class 标记
- 导航列表没有任何限制

点击查看[demo](https://desdesdesgo.github.io/vue-scrollwatch/)
 

查看源码中的App.vue 获得详细使用方式
## Installation

```bash
npm install --save vue-scrollwatch
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
 <div class="section" v-scrollWatch="{name:'b',offset:0,callback:spyDomChange}">scetcion 1</div>
<div class="section" v-scrollWatch="{name:'c',offset:0,callback:spyDomChange}">scetcion 2</div>
<div class="section" v-scrollWatch="{name:'d',offset:0,callback:spyDomChange}">scetcion 3</div>
<div class="section" v-scrollWatch="{name:'e',offset:0,callback:spyDomChange}">scetcion 4</div>

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


if you want to define a container to scroll (not window)
如果你想指定滚动容器，而不是window 

```html
<div id="#scrollDom">
    <div class="section" v-scrollWatch="{name:'b',offset:0,callback:spyDomChange}">scetcion 1</div>
    <div class="section" v-scrollWatch="{name:'c',offset:0,callback:spyDomChange}">scetcion 2</div>
    <div class="section" v-scrollWatch="{name:'d',offset:0,callback:spyDomChange}">scetcion 3</div>
    <div class="section" v-scrollWatch="{name:'e',offset:0,callback:spyDomChange}">scetcion 4</div>
<div>
```


```js 
scrollWatch.setContainer("#scrollDom")
```
you also can use class as selector
你也可以使用 class 来作为css 选择器

container and element to be watch hasn't to be father and sons
滚动容器和监听元素之间不一定是父子关系


### Options
#### name
*required:* `true` 

#### offset
元素位置偏移
*required:* `true` 

#### callback
*type:* `function`