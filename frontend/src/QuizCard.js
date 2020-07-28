import React from "react";
import "./QuizCard.css";

const QuizCard = ({ id, name, difficulty }) => {
  return (
    <div className="QuizCard card p-2 mb-1">
      <h5 className="card-title">{name}</h5>
      <p className="card-text">Difficulty: {difficulty}</p>
    </div>
  );
};

export default QuizCard;
