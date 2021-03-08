<template>
  <div class="wrapper">
    <div class="buttons">
      <button @click="clickStart" class="button__start">
        Start
      </button>
      <button @click="clickStop" class="button__stop">
        Stop
      </button>
      <button @click="clickClear" class="button__clear">
        Clear
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

const API_URL = "https://blockchain.info/ru/api/api_websocket";

@Component
export default class Panel extends Vue {
  socket: WebSocket | null = null;

  clickStart() {
    console.log("*** START");
  }
  clickStop() {
    console.log("*** STOP");
  }
  clickClear() {
    console.log("*** CLEAR");
  }

  mounted() {
    // "ws://javascript.ru/ws"
    this.socket = new WebSocket(API_URL);
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 400px;
  border: 2px solid black;
  padding: 15px;
  margin: auto;
}
.buttons {
  display: flex;
  justify-content: space-between;
}
.buttons button {
  font-size: 15px;
  border: 0;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:focus {
    outline: 0;
  }
}
.button__start {
  background: #58ba57;
}
.button__stop {
  background: #db524c;
}
.button__clear {
  background: #efac43;
}
</style>
