import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import DetailedQuizCard from "./DetailedQuizCard";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getQuizFromAPI } from "./actions/quizzes";
import { resetResponses } from "./actions/responses";

const Quiz = () => {
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
  const { id, name, difficulty, questions } = quiz;
  const goToActiveQuestion = (quiz, responses) => {
    const quizResponses = responses[quiz.id];
    const destinationRoute =
      quizResponses.length < quiz.questions.length
        ? `/quizzes/${quiz.id}/questions/${quizResponses.length}`
        : `/quizzes/${quiz.id}/results`;
    history.push(destinationRoute);
  };
  const activate = () => {
    goToActiveQuestion(quiz, responses);
  };
  const reset = () => {
    dispatch(resetResponses(quiz.id));
  };
  let buttonPrompt;
  if (responses[quiz.id].length === 0) {
    buttonPrompt = "Begin";
  } else {
    if (responses[quiz.id].length >= quiz.questions.length) {
      buttonPrompt = "View Results";
    } else {
      buttonPrompt = "Continue";
    }
  }
  return (
    <div className="Quiz">
      <DetailedQuizCard
        id={id}
        name={name}
        difficulty={difficulty}
        numQuestions={questions.length}
        numResponses={responses[quizId].length}
        buttonPrompt={buttonPrompt}
        activate={activate}
        reset={reset}
      />
    </div>
  );
};

export default Quiz;
