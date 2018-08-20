<template>
  <div>
    <navheader></navheader>
    <div class="main" id="scrollDom" key='1'>
      <div class="section section-a" v-scrollWatch="{name:'a',offset:0,callback:spyDomChange}">
        <h1>section 1</h1>
      </div>
      <div class="section  section-b" v-scrollWatch="{name:'b',offset:0,callback:spyDomChange}">
        <h1>section 2</h1>
      </div>
      <div class="section  section-c" v-scrollWatch="{name:'c',offset:0,callback:spyDomChange}">
        <h1>section 3</h1>
      </div>
      <div class="section  section-d" v-scrollWatch="{name:'d',offset:0,callback:spyDomChange}">
        <h1>section 4</h1>
      </div>
    </div>
  </div>
</template>
<script>
  import scrollWatch from "../lib/vue-scrollwatch"
  import navheader from "../components/navhead.vue"


  export default {
    name: "test",
    data() {
      return {}
    },
    components: {
      navheader
    },
    created() {
      scrollWatch.setContainer("#scrollDom")

    },
    methods: {
      // 滚动监听
      spyDomChange(node) {
        if (this.$store.state.activeMenu != node.name)
          this.$store.commit("changeActiveMenu", node.name);
      },
    }
  }

</script>
<style scoped>
  h1 {
    margin: 0;
  }

  .main {
    margin-top: 50px;
    padding-left: 200px;
    background: rgba(0, 0, 0, 0.1);
    height: 800px;
    overflow: auto;
  }

  .section {
    height: 1000px;
    text-align: center;
  }

  .section.section-a {
    background: #67C23A
  }

  .section.section-b {
    background: #E6A23C
  }

  .section.section-c {
    background: #909399
  }

  .section.section-d {
    background: #F56C6C
  }

</style>
