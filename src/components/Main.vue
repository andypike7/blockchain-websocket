<template>
  <div class="wrapper">
    <div class="buttons">
      <button
        :class="[
          'button__start',
          {
            'button--disabled':
              isSubscribed || messages.length === maxTransactions,
          },
        ]"
        @click="clickStart"
      >
        <span v-if="messages.length">Resume</span>
        <span v-else>Start</span>
      </button>
      <button
        :class="['button__stop', { 'button--disabled': !isSubscribed }]"
        @click="clickStop"
      >
        Stop
      </button>
      <button
        :class="['button__clear', { 'button--disabled': !messages.length }]"
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
      Total sum: {{ totalSum | toBtc }} BTC
      <div v-if="messages.length != maxTransactions" class="total-of">
        Transactions: <span>{{ messages.length }}</span> (of
        <span>{{ maxTransactions }}</span
        >).
      </div>
    </div>
    <table v-if="messages.length" class="table">
      <thead>
        <th>From</th>
        <th>To</th>
        <th>Sum</th>
      </thead>
      <tbody>
        <tr v-for="(message, index) in messages" :key="index">
          <td>
            <div v-for="(hash, key) in message.from" :key="key">
              {{ hash }}
            </div>
          </td>
          <td>
            <div v-for="(hash, key) in message.to" :key="key">
              {{ hash }}
            </div>
          </td>
          <td>{{ message.sum | toBtc }}</td>
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
import { MessageEvent, IncomingInputs, IncomingOut, Message } from '@/types';
import {
  API_URL,
  MAXIMUN_TRANSACTIONS,
  BTC_TO_SATOSHI,
  TOTAL_SUM_FRACTION_DIGITS,
} from '@/config';

@Component({
  filters: {
    toBtc(value: string) {
      return (+value / BTC_TO_SATOSHI).toFixed(TOTAL_SUM_FRACTION_DIGITS);
    },
  },
})
export default class Main extends Vue {
  ws: WebSocket | null = null;
  messages: Message[] = [];
  errorMessages: string[] = [];
  maxTransactions: number = MAXIMUN_TRANSACTIONS;
  isSubscribed = false;
  totalSum = 0;

  // Buttons actions

  clickStart() {
    if (this.ws !== null && !this.isSubscribed) {
      this.ws.send('{ "op": "unconfirmed_sub" }');
      this.isSubscribed = true;
    }
  }

  clickStop() {
    if (this.ws !== null && this.isSubscribed) {
      this.ws.send('{ "op": "unconfirmed_unsub" }');
      this.isSubscribed = false;
    }
  }

  clickClear() {
    this.messages = [];
    this.totalSum = 0;
  }

  // Websockets events

  onMessage(event: MessageEvent) {
    if (this.messages.length < MAXIMUN_TRANSACTIONS) {
      try {
        const data = JSON.parse(event.data);

        const sum: number = data.x.out.reduce(
          (acc: number, arr: IncomingOut) => acc + arr.value,
          0,
        );
        this.totalSum += sum;

        this.messages.push({
          from: data.x.inputs.map((arr: IncomingInputs) => arr.prev_out.addr),
          to: data.x.out.map((arr: IncomingOut) => arr.addr),
          sum,
        });
      } catch {
        this.errorMessages.push('Invalid data received.');
        this.clickStop();
      }
    } else {
      this.clickStop();
    }
  }

  onError() {
    this.errorMessages.push(`Connection cannot be established.`);
    this.clickStop();
  }

  // Lifecycles

  websocketConnect() {
    if (this.ws === null) {
      try {
        this.ws = new WebSocket(API_URL);
        this.ws.onmessage = this.onMessage;
        this.ws.onerror = this.onError;
        this.errorMessages = [];
      } catch {
        this.errorMessages.push('Connection error, retry in 5 sec...');
        setTimeout(this.websocketConnect, 5000);
      }
    }
  }

  mounted() {
    this.websocketConnect();
  }

  beforeDestroy() {
    if (this.ws !== null) {
      this.clickStop();
      this.ws.close();
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
  padding: 30px 0 20px;
  margin-bottom: -15px;
}
.no-transactions {
  color: silver;
  text-align: center;
  padding: 30px 30px 0;
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
.table {
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
