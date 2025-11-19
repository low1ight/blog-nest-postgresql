export function createExpirationDate(min: number) {
  return new Date(Date.now() + min * 60 * 1000).toISOString();
}
