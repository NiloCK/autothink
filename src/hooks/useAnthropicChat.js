import { useState, useCallback } from "react";
import Anthropic from "@anthropic-ai/sdk";

export const useAnthropicChat = (apiKey) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [complexityScore, setComplexityScore] = useState(null);
  const [thinkingBudget, setThinkingBudget] = useState(0);

  const analyzeComplexity = useCallback(
    async (query) => {
      if (!apiKey) return null;

      try {
        setIsLoading(true);

        const anthropic = new Anthropic({
          apiKey,
          dangerouslyAllowBrowser: true,
        });
        const response = await anthropic.messages.create({
          model: "claude-3-7-sonnet-20250219",
          max_tokens: 50,
          system:
            "You are an AI assistant that analyzes query complexity and returns ONLY a number from 0-100.",
          messages: [
            {
              role: "user",
              content: `Please analyze the following user query and rate its complexity on a scale from 0-100, where 0 means a simple, straightforward question requiring minimal reasoning, and 100 means an extremely complex problem requiring intensive step-by-step analysis. Provide ONLY a number between 0-100 with no explanation.\n\nUser query: "${query}"`,
            },
          ],
        });

        // Extract score as number from response
        const score = parseInt(response.content[0].text.trim(), 10);
        if (isNaN(score) || score < 0 || score > 100) {
          return 50; // Default to mid-range if parsing fails
        }

        return score;
      } catch (error) {
        console.error("Error analyzing complexity:", error);
        return 50; // Default score on error
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey],
  );

  const sendMessage = useCallback(
    async (userMessage) => {
      if (!apiKey || !userMessage) return;

      try {
        setIsLoading(true);

        // Add user message to chat
        const newMessages = [
          ...messages,
          { role: "user", content: userMessage },
        ];
        setMessages(newMessages);

        // Phase 1: Analyze complexity
        const score = await analyzeComplexity(userMessage);
        setComplexityScore(score);

        // Calculate thinking budget based on score
        const budget = calculateThinkingBudget(score);
        setThinkingBudget(budget);

        // Phase 2: Get response with appropriate thinking budget
        const anthropic = new Anthropic({
          apiKey,
          dangerouslyAllowBrowser: true,
        });

        const response = await anthropic.messages.create({
          model: "claude-3-7-sonnet-20250219",
          max_tokens: budget + 4000,
          system: "You are Claude, a helpful AI assistant.",
          messages: newMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          thinking:
            budget > 0
              ? {
                  type: "enabled",
                  budget_tokens: budget,
                }
              : {
                  type: "disabled",
                },
        });

        // Add response to messages
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              response.content.find((c) => c.type === "text")?.text || "",
            thinking:
              response.content.find((c) => c.type === "thinking")?.thinking ||
              null,
            complexityScore: score,
          },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, messages, analyzeComplexity],
  );

  return {
    messages,
    sendMessage,
    isLoading,
    complexityScore,
    thinkingBudget,
  };
};

// Convert complexity score to a thinking budget
const calculateThinkingBudget = (complexityScore) => {
  // Minimum thinking budget is 1024 tokens
  if (complexityScore < 10) return 0; // No extended thinking for simple queries

  // Scale from minimum (1024) to maximum (32000) based on complexity
  const minBudget = 1024;
  const maxBudget = 32000;
  return Math.round(
    minBudget + (maxBudget - minBudget) * (complexityScore / 100),
  );
};
