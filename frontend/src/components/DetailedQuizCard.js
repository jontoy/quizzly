import React from "react";
import "./QuizCard.css";
import { Link } from "react-router-dom";

const DetailedQuizCard = ({
  name,
  difficulty,
  numResponses = 0,
  numQuestions = 0,
  activate,
  buttonPrompt,
  reset,
}) => {
  return (
    <div className="QuizCard card p-2 mb-1 bg-light border-dark">
      <h4 className="card-title">{name}</h4>
      <p className="card-text">Difficulty: {difficulty}</p>
      <p className="card-text">
        Answered: {numResponses} of {numQuestions}
      </p>
      <div className="mb-3">
        <Link className="btn btn-outline-info" to="/quizzes">
          Back to Quizzes
        </Link>
      </div>

      {numQuestions > 0 && (
        <div>
          <button className="btn btn-success" onClick={activate}>
            {buttonPrompt}
          </button>
          {numResponses > 0 && (
            <button className="btn btn-danger ml-1" onClick={reset}>
              Reset Progress?
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailedQuizCard;
