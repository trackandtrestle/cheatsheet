// WeakSet: membership for objects without keeping them alive.

// 1) Track visited nodes while walking a graph that may contain cycles.
export interface Node {
  name: string;
  children: Node[];
}

export function collectNames(root: Node): string[] {
  const seen = new WeakSet<Node>();
  const names: string[] = [];
  const visit = (n: Node) => {
    if (seen.has(n)) return; // cycle or shared node
    seen.add(n);
    names.push(n.name);
    n.children.forEach(visit);
  };
  visit(root);
  return names;
}

// 2) Brand objects created by a trusted factory.
const validated = new WeakSet<object>();
export interface Email {
  readonly address: string;
}
export function parseEmail(input: string): Email | null {
  if (!/^[^@\s]+@[^@\s]+$/.test(input)) return null;
  const email: Email = Object.freeze({ address: input });
  validated.add(email);
  return email;
}
export const isValidated = (value: object): value is Email => validated.has(value);
