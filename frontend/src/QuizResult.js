import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getQuizFromAPI } from "./actions/quizzes";
import { resetResponses } from "./actions/responses";
import ResultsBanner from "./ResultsBanner";
import ResultsList from "./ResultsList";
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

  const results = quiz.questions.map(({ question_id, text }, idx) => ({
    id: question_id,
    text,
    isCorrect: quizResponses[idx],
  }));
  const countCorrect = (arr) => {
    let count = 0;
    for (let item of arr) {
      if (item) {
        count += 1;
      }
    }
    return count;
  };
  const numberCorrect = countCorrect(quizResponses);
  const totalQuestions = quiz.questions.length;
  const reset = () => {
    dispatch(resetResponses(quiz.id));
    history.push(`/quizzes/${quiz.id}`);
  };
  return (
    <div className="QuizResult container-fluid">
      <ResultsBanner
        numberCorrect={numberCorrect}
        totalQuestions={totalQuestions}
      />

      <ResultsList
        items={results.filter((item) => item.isCorrect)}
        correct={true}
      />
      <ResultsList
        items={results.filter((item) => !item.isCorrect)}
        correct={false}
      />
      <div className="container-fluid bg-light py-2">
        <button className="btn btn-danger" role="button" onClick={reset}>
          Retry Quiz?
        </button>
        <Link to="/quizzes">
          <button className="btn btn-info">Find more Quizzes</button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
