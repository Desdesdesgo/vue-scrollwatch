<template>
    <div >

        <ul class="nav-center" >
            <li  >
                <a  :class="{active:activeMenu == 'a'}" @click="scrollTo('a')">Section 1</a>
            </li>
            <li>
                <a  :class="{active:activeMenu == 'b'}" @click="scrollTo('b')">Section 2</a>
            </li>
            <li>
                <a  :class="{active:activeMenu == 'c'}" @click="scrollTo('c')">Section 3</a>
            </li>
            <li>
                <a  :class="{active:activeMenu == 'd'}" @click="scrollTo('d')">Section 4</a>
            </li>
        </ul>
        <div style="position:relative;top:50px;border:1px solid blue;overflow:auto;height:800px;"   id="scrollDom">
            <div style="position:relative;top:30px;">
                <div style="padding:30px;">
                    <div style="position:relative;left:150px;">
            <p class="section" v-scrollWatch="{name:'a',offset:0,callback:spyDomChange}">scetcion 1</p>
            <div class="section" v-scrollWatch="{name:'b',offset:0,callback:spyDomChange}">scetcion 2</div>
            <div class="section" v-scrollWatch="{name:'c',offset:0,callback:spyDomChange}">scetcion 3</div>
            <div class="section" v-scrollWatch="{name:'d',offset:0,callback:spyDomChange}">scetcion 4</div>
            <div class="section" v-scrollWatch="{name:'e',offset:0,callback:spyDomChange}">scetcion 5</div>
            </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>

import scrollWatch from "./lib/vue-scrollwatch"
scrollWatch.setContainer("#scrollDom")
export default {
    name: "test",
    data() {
        return {
            activeMenu: 1,
            scrollDom:this.$refs.scrollDom,
            scrollWatch:null,
        }
    },
    methods: {
        spyDomChange(node) {
            if (this.activeMenu != node.name)
                this.activeMenu = node.name
        },
        scrollTo(name){
            scrollWatch.scrollTo(name)
        }
    }
}
</script>
<style>
.nav-center {
  position: fixed;
  top:0px;
  z-index:999;
}
.section {
  width: 500px;
  height: 500px;
  border: 1px solid red;
}
.active {
  color: red;
}
</style>