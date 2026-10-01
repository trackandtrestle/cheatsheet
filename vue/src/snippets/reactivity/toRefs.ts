import { reactive, toRef, toRefs } from 'vue';

export function useCart() {
  const state = reactive({ items: 0, coupon: '' });
  const add = () => {
    state.items++;
  };
  // toRefs: every property becomes a Ref linked to `state` — safe to destructure.
  return { ...toRefs(state), add };
}

export function destructuringPitfall() {
  const state = reactive({ items: 0 });
  const { items: snapshot } = state; // plain number copied once — reactivity gone
  const { ...spread } = state; // spreading copies too

  const linked = toRef(state, 'items'); // two-way Ref to one property
  const readOnly = toRef(() => state.items); // getter form: read-only Ref

  state.items = 5;
  return { snapshot, spread, linked, readOnly };
}
