<template>
    <div>

        <ul class="nav-center">
            <button @click="$router.push('/')"><b> scroll in a container</b> </button>
            <li>
                <a :class="{active:activeMenu == 'a'}" @click="scrollTo('a')">Section 1</a>
            </li>
            <li>
                <a :class="{active:activeMenu == 'b'}" @click="scrollTo('b')">Section 2</a>
            </li>
            <li>
                <a :class="{active:activeMenu == 'c'}" @click="scrollTo('c')">Section 3</a>
            </li>
            <li>
                <a :class="{active:activeMenu == 'd'}" @click="scrollTo('d')">Section 4</a>
            </li>
        </ul>

        <div class="main" key='2'>
            <div class="section section-a" v-scrollWatch="{name:'a',offset:0,callback:spyDomChange}"><h1>section 1</h1></div>
            <div class="section  section-b" v-scrollWatch="{name:'b',callback:spyDomChange}"><h1>section 2</h1></div>
            <div class="section  section-c" v-scrollWatch="{name:'c',offset:100,callback:spyDomChange}">
                <h1>section 3</h1>
                <p>offset = 100</p>
                <p>偏移设置为100</p>
            </div>
            <div class="section  section-d" v-scrollWatch="{name:'d',offset:0,callback:spyDomChange}"><h1>section 4</h1></div>
        </div>
    </div>
</template>
<script>

import scrollWatch from "../lib/vue-scrollwatch"


export default {
    name: "test",
    data() {
        return {
            activeMenu: 1,
        }
    },
    created(){
       /*  scrollWatch.setContainer("#scrollDom") */
        
    },
    methods: {
        spyDomChange(node) {
            if (this.activeMenu != node.name)
                this.activeMenu = node.name
        },
        scrollTo(name) {
            scrollWatch.scrollTo(name)
        }
    }
}
</script>
<style scoped>
.nav-center {
    
    position: fixed;
    top: 0px;
    z-index: 999;
    
}
h1{
    margin:0;
}
.main{
    margin-top:0px;
    padding-left:200px;
    background: rgba(0,0,0,0.1);
   /*  height:800px;
    overflow:auto; */
}
.section {
    height: 1000px;
    text-align:center;
}
.section.section-a {
    background:#67C23A
}
.section.section-b {
    background:#E6A23C
}
.section.section-c {
    background:#909399
}
.section.section-d {
    background:#F56C6C
}
.active {
    color: #42b983;
}
</style>