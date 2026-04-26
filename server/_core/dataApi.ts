export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

// Social media data APIs are not configured — return empty results gracefully.
// To enable, integrate a third-party social media API and implement callDataApi.
export async function callDataApi(
  apiId: string,
  _options: DataApiCallOptions = {}
): Promise<unknown> {
  console.warn(`[DataAPI] ${apiId} not available (no API configured)`);
  return {};
}
