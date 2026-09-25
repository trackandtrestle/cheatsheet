import { useState } from 'react';

// Screen readers only announce CHANGES to a live region that already exists in the
// accessibility tree. So: render the (empty) region up front, then swap its text.
export function useAnnouncer() {
  const [message, setMessage] = useState('');
  const announce = (text: string) => {
    setMessage(''); // clear first so repeating the same text is re-announced
    requestAnimationFrame(() => setMessage(text));
  };
  return { message, announce };
}

export function CartButton() {
  const [count, setCount] = useState(0);
  const { message, announce } = useAnnouncer();
  const [error, setError] = useState('');
  const add = () => {
    if (count >= 3) return setError('Limit reached: max 3 per order'); // assertive
    const n = count + 1;
    setCount(n);
    announce(`Added to cart. ${n} item${n === 1 ? '' : 's'}.`); // polite: waits for a pause
  };
  return (
    <>
      <button onClick={add}>Add to cart</button>
      {/* role=status ≈ aria-live=polite; role=alert ≈ aria-live=assertive (interrupts) */}
      <div role="status" className="visually-hidden">{message}</div> {/* sr-only CSS */}
      <div role="alert">{error}</div>
    </>
  );
}
