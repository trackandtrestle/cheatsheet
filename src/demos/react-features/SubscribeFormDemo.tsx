import { SubscribeForm } from '../../snippets/react-features/SubscribeForm';

async function fakeSubscribe(email: string) {
  await new Promise((r) => setTimeout(r, 1000));
  if (email === 'taken@example.com') throw new Error(`${email} is already subscribed.`);
}

export function SubscribeFormDemo() {
  return (
    <div>
      <p className="mono">Try "nope", "taken@example.com", or any valid email.</p>
      <SubscribeForm subscribe={fakeSubscribe} />
    </div>
  );
}
