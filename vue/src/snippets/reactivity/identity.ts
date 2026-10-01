import { isProxy, reactive, toRaw } from 'vue';

export interface Item {
  id: number;
}

const raw: Item = { id: 1 };
const state = reactive(raw);

export const identity = {
  proxyIsNotRaw: state !== raw, // reactive() returns a Proxy
  cached: reactive(raw) === state, // same raw → same proxy
  idempotent: reactive(state) === state, // proxy of a proxy → itself
  rawBack: toRaw(state) === raw, // toRaw unwraps to the original
  isProxy: isProxy(state) && !isProxy(raw),
};

// Gotcha: elements read from a reactive array are proxies too.
const list = reactive<Item[]>([raw]);
export const found = list.find((item) => item === raw); // undefined: proxy !== raw
export const foundRaw = list.find((item) => toRaw(item) === raw); // works
export const included = list.includes(raw); // true: includes/indexOf also search raw values

// Gotcha: structuredClone (and postMessage) reject proxies — clone the raw object.
export const clone = (item: Item): Item => structuredClone(toRaw(item));
export { state, raw };
