import { startTransition, useOptimistic, useState } from 'react';

interface Props {
  initialLiked: boolean;
  save: (liked: boolean) => Promise<boolean>; // resolves with the server's truth
}

export function LikeButton({ initialLiked, save }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  // Shows `optimistic` while an action is pending, then falls back to `liked`.
  const [optimistic, setOptimistic] = useOptimistic(liked);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    const next = !optimistic;
    startTransition(async () => {
      setOptimistic(next); // must be called inside a transition/action
      try {
        const saved = await save(next);
        startTransition(() => setLiked(saved)); // updates after await need re-wrapping
        setError(null);
      } catch {
        setError('Could not save, reverted.'); // no manual rollback needed
      }
    });
  };

  return (
    <div className="demo-row">
      <button className="btn" aria-pressed={optimistic} onClick={toggle}>
        {optimistic ? 'Liked' : 'Like'}
      </button>
      {error && <span role="alert">{error}</span>}
    </div>
  );
}
