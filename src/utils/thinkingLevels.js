/**
 * Calculate appropriate thinking budget based on complexity score
 * @param {number} complexityScore - Score from 0-100
 * @returns {number} - Token budget for thinking
 */
export const calculateThinkingBudget = (complexityScore) => {
  // No extended thinking for very simple queries
  if (complexityScore < 10) return 0;

  // Minimum thinking budget is 1024 tokens
  const minBudget = 1024;
  const maxBudget = 32000;

  // Scale logarithmically to favor moderate thinking budgets
  // but still allow for larger budgets on very complex queries
  const scaleFactor = Math.log(complexityScore + 1) / Math.log(101);
  return Math.round(minBudget + (maxBudget - minBudget) * scaleFactor);
};

/**
 * Get descriptive label for complexity level
 * @param {number} score - Complexity score 0-100
 * @returns {string} - Human-readable description
 */
export const getComplexityLabel = (score) => {
  if (score < 10) return "Very Simple";
  if (score < 30) return "Simple";
  if (score < 50) return "Moderate";
  if (score < 70) return "Complex";
  if (score < 90) return "Very Complex";
  return "Extremely Complex";
};

/**
 * Get color for complexity visualization
 * @param {number} score - Complexity score 0-100
 * @returns {string} - CSS color value
 */
export const getComplexityColor = (score) => {
  if (score < 30) return "#4ade80"; // Green
  if (score < 60) return "#facc15"; // Yellow
  if (score < 80) return "#fb923c"; // Orange
  return "#ef4444"; // Red
};
