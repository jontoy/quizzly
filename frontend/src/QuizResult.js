import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getQuizFromAPI } from "./actions/quizzes";
import { resetResponses } from "./actions/responses";
import { Link } from "react-router-dom";

const QuizResult = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { quizId } = useParams();
  const quiz = useSelector((store) => store.quizzes[quizId]);
  const responses = useSelector((store) => store.responses);
  const missing = !quiz;

  useEffect(
    function () {
      if (missing) {
        dispatch(getQuizFromAPI(quizId));
      }
    },
    [quizId, missing, dispatch]
  );
  if (missing) {
    return <p>Loading &hellip;</p>;
  }
  const quizResponses = responses[quiz.id];

  const result = quiz.questions.map(({ question_id, text }, idx) => ({
    question_id,
    text,
    response: quizResponses[idx],
  }));
  const numberCorrect = quizResponses.reduce((curr, accum) => {
    if (curr) {
      accum += 1;
    }
    return accum || 0;
  }, 0);

  const reset = () => {
    dispatch(resetResponses(quiz.id));
    history.push(`/quizzes/${quiz.id}`);
  };
  return (
    <div className="QuizResult">
      <h2>{quiz.name} results:</h2>
      <ul>
        {result.map(({ question_id, text, response }) => (
          <li key={question_id}>
            {text} ---- {String(response)}
          </li>
        ))}
      </ul>
      <hr />
      <p>
        {numberCorrect} out of {quiz.questions.length},{" "}
        {(numberCorrect / quiz.questions.length) * 100}%
      </p>
      <button onClick={reset}>Try Again?</button>
      <Link to="/quizzes">Find more Quizzes</Link>
    </div>
  );
};

export default QuizResult;
