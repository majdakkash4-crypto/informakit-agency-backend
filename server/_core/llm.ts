import Anthropic from "@anthropic-ai/sdk";
import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: { url: string; detail?: "auto" | "low" | "high" };
};

export type FileContent = {
  type: "file_url";
  file_url: { url: string; mime_type?: string };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

export type InvokeParams = {
  messages: Message[];
  maxTokens?: number;
  max_tokens?: number;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: JsonSchema;
  output_schema?: JsonSchema;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: Role; content: string };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

function extractText(content: MessageContent | MessageContent[]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p) => (typeof p === "string" ? p : p.type === "text" ? p.text : ""))
      .join("\n");
  }
  return content.type === "text" ? content.text : "";
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  if (!ENV.anthropicApiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey: ENV.anthropicApiKey });

  const { messages, maxTokens, max_tokens, responseFormat, response_format, outputSchema, output_schema } = params;

  const systemMessages = messages.filter((m) => m.role === "system");
  const otherMessages = messages.filter((m) => m.role !== "system");

  let systemText = systemMessages.map((m) => extractText(m.content)).join("\n");

  const rf = responseFormat || response_format;
  const schema = outputSchema || output_schema;
  const isJsonMode = rf?.type === "json_schema" || rf?.type === "json_object" || schema;

  if (isJsonMode) {
    const schemaName = rf?.type === "json_schema" ? rf.json_schema.name : schema?.name ?? "response";
    systemText += `\n\nRespond with a valid JSON object for "${schemaName}". Output only the raw JSON, no markdown or code blocks.`;
  }

  const anthropicMessages = otherMessages.map((m) => ({
    role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
    content: extractText(m.content),
  }));

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens || max_tokens || 8192,
    ...(systemText ? { system: systemText } : {}),
    messages: anthropicMessages,
  });

  const content = response.content[0]?.type === "text" ? response.content[0].text : "";

  return {
    id: response.id,
    created: Math.floor(Date.now() / 1000),
    model: response.model,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content },
        finish_reason: response.stop_reason ?? null,
      },
    ],
    usage: {
      prompt_tokens: response.usage.input_tokens,
      completion_tokens: response.usage.output_tokens,
      total_tokens: response.usage.input_tokens + response.usage.output_tokens,
    },
  };
}
