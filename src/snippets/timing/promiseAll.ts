interface User {
  name: string;
}

// Independent requests: start both, then await together (typed tuple result).
// Fail-fast: rejects with the FIRST rejection; the others keep running.
export async function loadDashboard(
  getUser: () => Promise<User>,
  getCount: () => Promise<number>,
): Promise<string> {
  const [user, count] = await Promise.all([getUser(), getCount()]);
  return `${user.name} has ${count} items`;
}

// Accidental waterfall: the second request doesn't start until the first ends.
export async function loadDashboardSlow(
  getUser: () => Promise<User>,
  getCount: () => Promise<number>,
): Promise<string> {
  const user = await getUser();
  const count = await getCount();
  return `${user.name} has ${count} items`;
}
