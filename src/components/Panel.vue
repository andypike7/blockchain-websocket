`<template>
  <div class="wrapper">
    <div class="buttons">
      <button
        @click="clickStart"
        :class="{
          button__start: true,
          'button--disabled': isConnected,
        }"
      >
        Start
      </button>
      <button
        @click="clickStop"
        :class="{
          button__stop: true,
          'button--disabled': !isConnected,
        }"
      >
        Stop
      </button>
      <button
        @click="clickClear"
        :class="{
          button__clear: true,
          'button--disabled': !messages.length,
        }"
      >
        Clear
      </button>
    </div>
    <div class="total-sum">Total sum: {{ totalSum }} BTC</div>
    <table v-if="messages.length">
      <thead>
        <th>From</th>
        <th>To</th>
        <th>Sum</th>
      </thead>
      <tbody>
        <tr v-for="(message, index) in messages" :key="index">
          <td>
            <div v-for="(hash, index) in message.from" :key="index">
              {{ hash }}
            </div>
          </td>
          <td>
            <div v-for="(hash, index) in message.from" :key="index">
              {{ hash }}
            </div>
          </td>
          <td>{{ message.sum }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="no-transactions">
      No transactions now.
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

const API_URL = 'wss://ws.blockchain.info/inv';

type MessageEvent = {
  data: string;
};

type Message = {
  from: string[];
  to: string[];
  sum: number;
};

@Component({
  name: 'panel',
})
export default class Panel extends Vue {
  ws: WebSocket | null = null;
  messages: Message[] = [];
  isConnected = false;
  totalSum = 0;

  clickStart() {
    if (this.isConnected) return;
    console.log('*** START');

    this.ws = new WebSocket(API_URL);
    // TODO: checking

    this.ws.onopen = this.onOpen;
    this.ws.onclose = this.onClose;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;

    this.isConnected = true;
  }

  onOpen(event: Event) {
    console.log('*** ON OPEN:', event);
    if (this.ws !== null) {
      // this.ws.send('{ op: "ping" }');
      // this.ws.send('{ op: "unconfirmed_sub" }');
      console.log('*** ON OPEN SEND:', '{ "op": "blocks_sub" }');
      this.ws.send('{ "op": "unconfirmed_sub" }');
    }
  }

  clickStop() {
    if (!this.isConnected) return;
    console.log('*** START');

    this.isConnected = false;
    console.log('*** STOP');
  }
  clickClear() {
    console.log('*** CLEAR');
  }

  onClose(event: Event) {
    console.log('*** ON CLOSE:', event);
  }

  // "ws://javascript.ru/ws"
  /*
    OPEN =>
      SEND ping =>
        MESSAGE pong
  */

  onMessage(event: MessageEvent) {
    if (this.messages.length < 5) {
      try {
        const data = JSON.parse(event.data);
        console.log('*** DATA:', data);

        const from = data.x.inputs.map((arr) => arr.prev_out.addr);
        const to = data.x.out.map((arr) => arr.addr);
        const sum = 0.012345;

        const message: Message = { from, to, sum };

        // 1A828tTnkVFJfSvLCqF42ohZ51ksS3jJgX
        // 1BwGf3z7n2fHk6NoVJNkV32qwyAYsMhkWf

        this.messages.push(message);
        console.log('*** MESSAGE:', message);
      } catch {
        console.log('*** INVALID MESSAGE!!!');
      }
    } else {
      console.log('*** UNSUBSCCRIBE!');
      if (this.ws !== null) {
        this.ws.send('{ op: "unconfirmed_sub" }');
      }
    }
  }
  onError(event: Event) {
    console.log('*** ON ERROR:', event);
  }

  mounted() {
    console.clear();
    // this.clickStart();
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
  width: 650px;
  padding: 5px;
  margin: auto;
}
.buttons {
  display: flex;
  justify-content: space-between;
}
.buttons button {
  font-size: 15px;
  color: white;
  border: 0;
  border-radius: 5px;
  padding: 5px 65px;
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
.button--disabled {
  background: silver;
  cursor: not-allowed !important;
  &:hover {
    opacity: 1 !important;
  }
}
.no-transactions {
  color: silver;
  text-align: center;
  padding: 10px;
}
.total-sum {
  padding-top: 20px;
  font-weight: bold;
  font-size: 20px;
}
table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
  th,
  td {
    padding: 5px 10px;
    font-size: 12px;
    border: 1px solid gray;
    div {
      padding: 3px 0;
    }
  }
}
</style>
