// Image generation is not configured in this setup.
export async function generateImage(_params: { prompt: string }): Promise<{ url: string }> {
  throw new Error("Image generation is not configured");
}
