import { describe, expect, expectTypeOf, it } from 'vitest';
import { buildPath, eventName } from './templateLiteral';
import type { EnvKey, EventName, Handlers, RouteParams } from './templateLiteral';

describe('template literal types', () => {
  it('builds string unions', () => {
    expectTypeOf<EventName>().toEqualTypeOf<
      'user:created' | 'user:deleted' | 'post:created' | 'post:deleted'
    >();
    expectTypeOf<EnvKey<'api_url'>>().toEqualTypeOf<'APP_API_URL'>();
    expectTypeOf<Handlers<'open' | 'close'>>().toEqualTypeOf<{ onOpen: () => void; onClose: () => void }>();
    const e = eventName('post', 'deleted');
    expectTypeOf(e).toEqualTypeOf<'post:deleted'>();
    expect(e).toBe('post:deleted');
  });

  it('parses strings with infer', () => {
    expectTypeOf<RouteParams<'/users/:userId/posts/:postId'>>().toEqualTypeOf<'userId' | 'postId'>();
    expect(buildPath('/users/:userId/posts/:postId', { userId: '7', postId: 'a b' })).toBe(
      '/users/7/posts/a%20b',
    );
    // @ts-expect-error — postId is missing
    buildPath('/users/:userId/posts/:postId', { userId: '7' });
  });
});
