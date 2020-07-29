import React from "react";

const ResultsBanner = ({ numberCorrect, totalQuestions }) => {
  const score = numberCorrect / totalQuestions;
  let color;
  let topMessage;
  let bottomMessage;
  let textColor = "light";
  if (score >= 0.9) {
    color = "success";
    topMessage = "Congratulations!";
    bottomMessage = "You really know your stuff!";
  } else {
    if (score >= 0.5) {
      color = "info";
      topMessage = "So close!";
      bottomMessage = "You almost had it!";
    } else {
      color = "warning";
      topMessage = "Too bad...";
      bottomMessage = "Review the material and give it another shot!";
      textColor = "dark";
    }
  }
  return (
    <div className={`ResultsBanner jumbotron bg-${color} text-${textColor}`}>
      <h1 className="display-4">{topMessage}</h1>
      <p className="lead">
        You got {numberCorrect} out of {totalQuestions} correct on this attempt.
      </p>
      <hr className="my-4" />
      <p>{bottomMessage}</p>
    </div>
  );
};
export default ResultsBanner;
