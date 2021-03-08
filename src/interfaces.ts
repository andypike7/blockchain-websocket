export type IMessageEvent = {
  data: string;
};

export type IIncomingInputs = {
  prev_out: {
    addr: string;
    value: number;
  };
};

export type IIncomingOut = {
  addr: string;
  value: number;
};

export type Message = {
  from: string[];
  to: string[];
  sum: number;
};
