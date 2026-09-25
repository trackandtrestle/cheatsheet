import { useState } from 'react';

function CommentBox({ userId }: { userId: string }) {
  const [draft, setDraft] = useState('');
  return (
    <label>
      Comment for {userId}
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />
    </label>
  );
}

// A different key = a different component instance: all state inside resets.
// Bad alternative: useEffect(() => setDraft(''), [userId]) renders stale text first.
export function Profile({ userId }: { userId: string }) {
  return <CommentBox key={userId} userId={userId} />;
}
