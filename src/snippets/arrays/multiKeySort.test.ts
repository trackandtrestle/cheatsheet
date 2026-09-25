import { describe, expect, it } from 'vitest';
import { by, byLastFirstAgeDesc, thenBy, type Person } from './multiKeySort';

const people: Person[] = [
  { last: 'Smith', first: 'Bo', age: 30 },
  { last: 'Adams', first: 'Cy', age: 20 },
  { last: 'Smith', first: 'Al', age: 40 },
  { last: 'Smith', first: 'Al', age: 50 },
];

describe('multi-key comparator', () => {
  it('chains with ||', () => {
    const names = people.toSorted(byLastFirstAgeDesc).map((p) => `${p.first}${p.age}`);
    expect(names).toEqual(['Cy20', 'Al50', 'Al40', 'Bo30']);
  });
  it('composes comparators', () => {
    const cmp = thenBy<Person>(by((p) => p.age, -1), by((p) => p.last));
    expect(people.toSorted(cmp).map((p) => p.age)).toEqual([50, 40, 30, 20]);
  });
});
