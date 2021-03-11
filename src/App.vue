<template>
  <div id="app">
    <h1>
      Blockchain Websocket demo
      <a
        class="github"
        href="https://github.com/andypike7/blockchain-websocket"
      >
        View source on Github.
      </a>
    </h1>
    <Main />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Main from '@/components/Main.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Main,
  },
});
</script>

<style lang="scss">
#app {
  font-family: Arial;
  text-align: center;
}
h1 {
  min-width: 570px !important;
}
.github {
  font-size: 12px;
  color: blue;
  display: block;
  font-weight: normal;
}
</style>
