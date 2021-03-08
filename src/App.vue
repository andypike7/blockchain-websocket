<template>
  <div id="app">
    <h1>Blockchain Websocket</h1>
    <Panel />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Panel from "@/components/Panel";

export default Vue.extend({
  name: "App",
  components: {
    Panel
  }
});
</script>

<style lang="scss">
#app {
  font-family: Arial;
  text-align: center;
}
</style>
