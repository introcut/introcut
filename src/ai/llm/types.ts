// The one interface every language model sits behind (local, the user's own key, or none).
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompleteOptions {
  signal?: AbortSignal;
  /** Lower = more predictable. Brief and script work want low. */
  temperature?: number;
}

export interface LlmProvider {
  id: string;
  label: string;
  /** Plain text back. Callers ask for JSON in the prompt and validate it themselves. */
  complete(messages: ChatMessage[], opts?: CompleteOptions): Promise<string>;
  /** Model names the provider offers (also a cheap way to test the key and browser access). */
  listModels(opts?: { signal?: AbortSignal }): Promise<string[]>;
}

/** A failure the user can act on, with a plain-language message. */
export class LlmError extends Error {
  constructor(
    message: string,
    readonly kind: "network" | "auth" | "rate-limit" | "server" | "bad-output" | "aborted" | "not-configured",
  ) {
    super(message);
    this.name = "LlmError";
  }
}
