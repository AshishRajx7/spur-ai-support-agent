export interface LLMProvider {
  generateReply(
    history: unknown[],
    userMessage: string,
    knowledgeContext: string,
  ): Promise<string>;
}
