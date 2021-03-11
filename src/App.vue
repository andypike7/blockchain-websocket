<template>
  <div id="app">
    <h1>Blockchain Websocket demo</h1>
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
</style>
