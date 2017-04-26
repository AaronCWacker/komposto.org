const initialState = {
  tick: 0,
};

let state = {};

export const exists = key => key in state;
export const incr = key => state[key]++;
export const decr = key => state[key]--;
export const set = (key, val) => state[key] = val;
export const get = key => state[key];
export const getInitialState = () => initialState;
export const updateState = (newState) => state = newState;
export const getState = () => state;
export const setState = updates => updateState({ ...state, ...updates });
