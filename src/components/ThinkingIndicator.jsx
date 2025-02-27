import {
  getComplexityColor,
  getComplexityLabel,
} from "../utils/thinkingLevels";

/**
 * Component that displays an animated indicator when Claude is thinking
 *
 * @param {Object} props
 * @param {number|null} props.complexityScore - Optional complexity score (0-100)
 */
const ThinkingIndicator = ({ complexityScore }) => {
  // Determine if we're in the phase of analyzing complexity or responding
  const isAnalyzing = complexityScore === null || complexityScore === undefined;

  // Get appropriate label and color if complexity score is available
  const label = !isAnalyzing ? getComplexityLabel(complexityScore) : null;
  const color = !isAnalyzing ? getComplexityColor(complexityScore) : null;

  return (
    <div className="thinking-indicator">
      {isAnalyzing ? (
        <>
          <span>Analyzing question complexity</span>
          <div className="thinking-dots">
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
          </div>
        </>
      ) : (
        <>
          <span>
            Thinking ({label} - {complexityScore}/100)
          </span>
          <div className="thinking-dots">
            <div
              className="thinking-dot"
              style={{ backgroundColor: color }}
            ></div>
            <div
              className="thinking-dot"
              style={{ backgroundColor: color }}
            ></div>
            <div
              className="thinking-dot"
              style={{ backgroundColor: color }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThinkingIndicator;
