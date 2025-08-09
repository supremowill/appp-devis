export function getMapboxToken(): string {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    throw new Error('MAPBOX_TOKEN is not defined');
  }
  return token;
}
