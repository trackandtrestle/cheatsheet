import { Suspense, use } from 'react';

export interface User { id: string; name: string }

// Create/cache promises OUTSIDE render. `use(fetchUser(id))` inline would make
// a new promise on every render -> suspends forever.
const cache = new Map<string, Promise<User>>();

export function getUser(id: string, load: (id: string) => Promise<User>): Promise<User> {
  let promise = cache.get(id);
  if (!promise) {
    promise = load(id);
    cache.set(id, promise);
  }
  return promise;
}

function UserName({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // suspends while pending; throws if rejected
  return <p>{user.name}</p>;
}

export function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  return (
    <Suspense fallback={<p role="status">Loading…</p>}>
      <UserName userPromise={userPromise} />
    </Suspense>
  );
}
