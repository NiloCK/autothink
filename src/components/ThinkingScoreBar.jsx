import {
  getComplexityColor,
  getComplexityLabel,
} from "../utils/thinkingLevels";

const ThinkingScoreBar = ({ score, thinkingBudget }) => {
  if (score === null) return null;

  const color = getComplexityColor(score);
  const label = getComplexityLabel(score);

  return (
    <div className="thinking-score-container">
      <div className="thinking-metadata">
        <div className="complexity-label">
          <span>Complexity: {label}</span>
          <span className="score-value">{score}/100</span>
        </div>
        {thinkingBudget > 0 && (
          <div className="thinking-budget">
            Extended thinking: {Math.round(thinkingBudget / 1000)}K tokens
          </div>
        )}
      </div>

      <div className="score-bar-container">
        <div
          className="score-bar-fill"
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default ThinkingScoreBar;
