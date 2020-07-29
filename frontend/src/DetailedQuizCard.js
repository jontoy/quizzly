import React from "react";
import "./QuizCard.css";
import { Link } from "react-router-dom";

const DetailedQuizCard = ({
  name,
  difficulty,
  numResponses,
  numQuestions,
  activate,
  buttonPrompt,
  reset,
}) => {
  return (
    <div className="QuizCard card p-2 mb-1">
      <h5 className="card-title">{name}</h5>
      <p className="card-text">Difficulty: {difficulty}</p>
      <p className="card-text">
        Answered: {numResponses} of {numQuestions}
      </p>

      <Link to="/quizzes">Back to Quizzes</Link>
      {numQuestions > 0 && (
        <>
          <button onClick={activate}>{buttonPrompt}</button>
          {numResponses > 0 && <button onClick={reset}>Reset Progress?</button>}
        </>
      )}
    </div>
  );
};

export default DetailedQuizCard;
