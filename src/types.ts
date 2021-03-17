export type MessageEvent = {
  data: string;
};

export type IncomingInputs = {
  prev_out: {
    addr: string;
    value: number;
  };
};

export type IncomingOut = {
  addr: string;
  value: number;
};

export type Message = {
  from: string[];
  to: string[];
  sum: number;
};
