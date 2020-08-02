import React from "react";
import "./QuizCard.css";

const QuizCard = ({ name, difficulty }) => {
  return (
    <div className="QuizCard card p-2 mb-1 bg-light">
      <h5 className="card-title">{name}</h5>
      <p className="card-text">Difficulty: {difficulty}</p>
    </div>
  );
};

export default React.memo(QuizCard);
