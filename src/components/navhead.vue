<template>
  <div>

    <ul class="nav-center">
      <button @click="$router.push('/page1')">
        <b>scroll in window</b>
      </button>
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
  </div>
</template>
<script>
  import scrollWatch from "../lib/vue-scrollwatch"


  export default {
    name: "test",
    data() {
      return {}
    },
    created() {
      scrollWatch.setContainer("#scrollDom")

    },
    computed: {
      activeMenu() {
        // 用于滚动监听
        return this.$store.state.activeMenu;
      },
    },
    methods: {
      scrollTo(name) {
        // 用于滚动监听
        this.$router.push('/#' + name);
        scrollWatch.scrollTo(name)
      },
    }
  }

</script>
<style scoped>
  .nav-center {

    position: fixed;
    top: 50px;
    z-index: 999;

  }

  .active {
    color: #42b983;
  }

</style>
