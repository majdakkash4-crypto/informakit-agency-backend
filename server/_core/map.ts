// Google Maps integration is not configured in this setup.
export async function makeRequest<T>(_endpoint: string, _params?: Record<string, unknown>): Promise<T> {
  throw new Error("Maps API is not configured");
}
