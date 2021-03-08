`<template>
  <div class="wrapper">
    <div class="buttons">
      <button
        :class="{
          button__start: true,
          'button--disabled': ws !== null,
        }"
        @click="clickStart"
      >
        <span v-if="messages.length">Resume</span>
        <span v-else>Start</span>
      </button>
      <button
        :class="{
          button__stop: true,
          'button--disabled': ws === null,
        }"
        @click="clickStop"
      >
        Stop
      </button>
      <button
        :class="{
          button__clear: true,
          'button--disabled': !messages.length,
        }"
        @click="clickClear"
      >
        Clear
      </button>
    </div>
    <div v-if="errorMessages.length" class="error-messages">
      <div v-for="(errorMessage, index) in errorMessages" :key="index">
        {{ errorMessage }}
      </div>
    </div>
    <div v-if="messages.length" class="total-sum">
      Total sum: {{ totalSum }} BTC
      <div v-if="messages.length != maxTransactions" class="total-of">
        Transactions:
        <span>{{ messages.length }}</span> of
        <span>{{ maxTransactions }}</span> max.
      </div>
    </div>
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
            <div v-for="(hash, index) in message.to" :key="index">
              {{ hash }}
            </div>
          </td>
          <td>{{ message.sum / 100000000 }}</td>
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
import { API_URL, MAXIMUN_TRANSACTIONS, DEBUG_MODE } from '@/config';
import {
  IMessageEvent,
  IIncomingInputs,
  IIncomingOut,
  Message,
} from '@/interfaces';

@Component({
  name: 'panel',
})
export default class Panel extends Vue {
  ws: WebSocket | null = null;
  messages: Message[] = [];
  errorMessages: string[] = [];
  maxTransactions: number = MAXIMUN_TRANSACTIONS;

  // Button actions

  clickStop() {
    if (this.ws !== null) {
      try {
        this.ws.send('{ op: "unconfirmed_unsub" }');
        this.ws.close();
      } catch (e) {
        console.log(e);
      }
    }
  }

  clickClear() {
    this.messages = [];
    this.errorMessages = [];
  }

  clickStart() {
    if (this.ws === null) {
      try {
        this.ws = new WebSocket(API_URL);

        this.ws.onopen = this.onOpen;
        this.ws.onclose = this.onClose;
        this.ws.onmessage = this.onMessage;
        this.ws.onerror = this.onError;
      } catch {
        this.errorMessages.push('Connection error');
      }
    }
  }

  // Websockets events

  onOpen() {
    if (this.ws !== null) {
      this.ws.send('{ "op": "unconfirmed_sub" }');
    }
  }

  onClose() {
    this.ws = null;
  }

  onMessage(event: IMessageEvent) {
    if (this.messages.length < MAXIMUN_TRANSACTIONS) {
      try {
        const data = JSON.parse(event.data);

        this.messages.push({
          from: data.x.inputs.map((arr: IIncomingInputs) => arr.prev_out.addr),
          to: data.x.out.map((arr: IIncomingOut) => arr.addr),
          sum: data.x.out.reduce(
            (acc: number, arr: IIncomingOut) => acc + arr.value,
            0,
          ),
        });
      } catch {
        this.errorMessages.push('Invalid data received.');
      }
    } else {
      console.log('*** UNSUBSCRIBE!');
      if (this.ws !== null) {
        this.clickStop();
      }
    }
  }

  onError() {
    this.errorMessages.push('Connection could not be established.');
    return false;
  }

  // Misc

  get totalSum() {
    const sum = this.messages.reduce(
      (acc: number, message: Message) => acc + message.sum,
      0,
    );

    return (sum / 100000000).toFixed(3);
  }

  // Life cycles

  mounted() {
    if (DEBUG_MODE) {
      console.clear();
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 570px;
  padding: 5px;
  margin: auto;
}
.buttons {
  display: flex;
  justify-content: center;
  grid-column-gap: 30px;
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
.error-messages {
  color: red;
  text-align: center;
  padding: 30px 0 0;
  margin-bottom: -15px;
}
.no-transactions {
  color: silver;
  text-align: center;
  padding: 30px;
  font-size: 32px;
}
.total-sum {
  padding-top: 20px;
  font-weight: bold;
  font-size: 20px;
  .total-of {
    font-size: 10px;
    color: silver;
    span {
      color: gray;
    }
  }
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
