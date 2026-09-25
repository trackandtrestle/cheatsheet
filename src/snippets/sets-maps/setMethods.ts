// ES2025 Set methods (Node 22+, Chrome 122+, Safari 17+, Firefox 127+).
// Each returns a NEW Set (or boolean); the receiver is never mutated.
const frontend = new Set(['ts', 'react', 'css']);
const backend = new Set(['ts', 'go', 'sql']);

export const all = frontend.union(backend); // ts react css go sql
export const shared = frontend.intersection(backend); // ts
export const onlyFrontend = frontend.difference(backend); // react css
export const eitherNotBoth = frontend.symmetricDifference(backend); // react css go sql

export const isSubset = new Set(['ts']).isSubsetOf(frontend); // true
export const isSuperset = frontend.isSupersetOf(new Set(['css'])); // true
export const disjoint = frontend.isDisjointFrom(new Set(['rust'])); // true

// The argument only needs to be "set-like" (size, has, keys): a Map works.
const roles = new Map([['ts', 'lang'], ['sql', 'lang']]);
export const langsInFrontend = frontend.intersection(roles); // ts
