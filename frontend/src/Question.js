import React, { useEffect, useState, useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import QuizzlyApi from "./QuizzlyApi";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getQuizFromAPI } from "./actions/quizzes";
import { getQuestionFromAPI } from "./actions/questions";
import { addResponse } from "./actions/responses";

const Question = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { quizId, questionNumber } = useParams();

  const quiz = useSelector((store) => store.quizzes[quizId]);
  const missingQuiz = !quiz;

  const { questions, responses } = useSelector((store) => store);
  const question = missingQuiz
    ? null
    : questions[quiz.questions[questionNumber].question_id];
  const missingQuestion = !question;
  useEffect(
    function () {
      if (!missingQuiz && missingQuestion) {
        dispatch(
          getQuestionFromAPI(quiz.questions[questionNumber].question_id)
        );
      } else {
        if (missingQuiz) {
          dispatch(getQuizFromAPI(quizId));
        }
      }
    },
    [missingQuiz, missingQuestion, questionNumber, quizId, dispatch]
  );
  const goToActiveQuestion = (quiz, responses) => {
    const quizResponses = responses[quiz.id];
    const destinationRoute =
      quizResponses.length < quiz.questions.length
        ? `/quizzes/${quiz.id}/questions/${quizResponses.length}`
        : `/quizzes/${quiz.id}/results`;
    history.push(destinationRoute);
  };

  const BASE_STATE = { choice: "" };
  const [formData, setFormData] = useState(BASE_STATE);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      errors: [],
      [name]: value,
    }));
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const userChoice = question.options[formData.choice];
    dispatch(
      addResponse(
        quizId,
        questionNumber,
        userChoice ? userChoice.is_correct : false
      )
    );
    goToActiveQuestion(quiz, responses);
  };

  if (missingQuestion) {
    return <p>Loading &hellip;</p>;
  }
  return (
    <div className="Question">
      <h2>
        Question {Number(questionNumber) + 1} of {quiz.questions.length}
      </h2>
      <h4>{question.text}</h4>
      <p>The selected option is: {formData.choice}</p>
      <form onSubmit={handleSubmit}>
        {question.options.map((opt, idx) => (
          <label key={opt.option_id}>
            <input
              type="radio"
              value={idx}
              name="choice"
              onChange={handleChange}
            />
            {opt.value}
          </label>
        ))}
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Question;
