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
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

const API_URL = 'wss://ws.blockchain.info/inv';

@Component({
  name: 'panel',
})
export default class Panel extends Vue {
  ws: WebSocket | null = null;

  clickStart() {
    console.log('*** START');
  }
  clickStop() {
    console.log('*** STOP');
  }
  clickClear() {
    console.log('*** CLEAR');
  }

  onOpen(evt: Event) {
    console.log('*** ON OPEN:', evt);
    if (this.ws !== null) {
      this.ws.send('{ op: "ping" }');
    }
  }
  onClose(evt: Event) {
    console.log('*** ON CLOSE:', evt);
  }
  onMessage(evt: Event) {
    console.log('*** ON MESSAGE:', evt);
  }
  onError(evt: Event) {
    console.log('*** ON ERROR:', evt);
  }

  mounted() {
    // "ws://javascript.ru/ws"
    /*
      OPEN =>
        SEND ping =>
          MESSAGE pong
    */
    this.ws = new WebSocket(API_URL);
    this.ws.onopen = evt => {
      this.onOpen(evt);
    };
    this.ws.onclose = evt => {
      this.onClose(evt);
    };
    this.ws.onmessage = evt => {
      this.onMessage(evt);
    };
    this.ws.onerror = evt => {
      this.onError(evt);
    };
    // this.ws.
  }
}

/*
<!DOCTYPE html>
  <meta charset="utf-8" />
  <title>WebSocket Test</title>
  <script language="javascript" type="text/javascript">

  var wsUri = "wss://echo.websocket.org/";
  var output;

  function init()
  {
    output = document.getElementById("output");
    testWebSocket();
  }

  function testWebSocket()
  {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
    writeToScreen("CONNECTED");
    doSend("WebSocket rocks");
  }

  function onClose(evt)
  {
    writeToScreen("DISCONNECTED");
  }

  function onMessage(evt)
  {
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    websocket.close();
  }

  function onError(evt)
  {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  }

  function doSend(message)
  {
    writeToScreen("SENT: " + message);
    websocket.send(message);
  }

  function writeToScreen(message)
  {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
  }

  window.addEventListener("load", init, false);

  < /script >

  <h2>WebSocket Test</h2>

  <div id="output"></div>
*/
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
