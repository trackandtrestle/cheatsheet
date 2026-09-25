import { useState } from 'react';
import { LikeButton } from '../../snippets/react-features/LikeButton';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function LikeButtonDemo() {
  const [failNext, setFailNext] = useState(false);

  const save = async (liked: boolean) => {
    await wait(1000); // pretend network
    if (failNext) throw new Error('Server error');
    return liked;
  };

  return (
    <div className="demo-row">
      <LikeButton initialLiked={false} save={save} />
      <label>
        <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} />{' '}
        Make the server fail (1 s latency)
      </label>
    </div>
  );
}
