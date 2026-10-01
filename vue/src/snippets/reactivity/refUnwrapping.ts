import { reactive, ref, type Ref } from 'vue';

const count = ref(1);

// 1. A ref nested in a reactive OBJECT is unwrapped: no `.value`, and writes go through.
const state = reactive({ count });
state.count++; // count.value === 2 — same underlying ref
const n: number = state.count;

// 2. Refs inside reactive ARRAYS and collections (Map/Set) are NOT unwrapped.
const list = reactive([ref(10)]);
const first: Ref<number> | undefined = list[0]; // first?.value === 10

const map = reactive(new Map([['a', ref(20)]]));
const fromMap: Ref<number> | undefined = map.get('a'); // fromMap?.value === 20

// 3. shallowReactive does not unwrap either (only the root is reactive).

export { count, state, n, first, fromMap };
