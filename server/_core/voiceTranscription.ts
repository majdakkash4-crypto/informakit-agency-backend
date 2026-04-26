// Voice transcription is not configured in this setup.
export async function transcribeAudio(_audioUrl: string): Promise<{ text: string }> {
  throw new Error("Voice transcription is not configured");
}
