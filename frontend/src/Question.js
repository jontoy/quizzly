import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getQuizFromAPI } from "./actions/quizzes";
import { getQuestionFromAPI } from "./actions/questions";
import { addResponse } from "./actions/responses";
import "./Question.css";

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

  const BASE_STATE = { choice: null };
  const [formData, setFormData] = useState(BASE_STATE);
  const captureFormData = ({ name, value }) => {
    setFormData((data) => ({
      ...data,
      errors: [],
      [name]: value,
    }));
  };
  const handleChange = (e) => captureFormData(e.target);

  const handleClick = (e) => {
    const input = e.target.querySelector("input");
    if (input) captureFormData(input);
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
    setFormData((data) => BASE_STATE);
    goToActiveQuestion(quiz, responses);
  };

  if (missingQuestion) {
    return <p>Loading &hellip;</p>;
  }
  return (
    <div className="Question container">
      <span className="Question-counter">
        Question {Number(questionNumber) + 1} of {quiz.questions.length}
      </span>
      <h4>{question.text}</h4>
      <form onSubmit={handleSubmit}>
        <ul className="list-unstyled">
          {question.options.map((opt, idx) => (
            <li className="Question-option my-1">
              <div className="card bg-light border-dark">
                <div className="card-body">
                  <div className="form-check px-5" onClick={handleClick}>
                    <input
                      className="form-check-input"
                      type="radio"
                      value={idx}
                      name="choice"
                      id={`option${idx}`}
                      checked={String(formData["choice"]) === String(idx)}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor={`option${idx}`}
                      className="form-check-label"
                      key={opt.option_id}
                    >
                      {opt.value}
                    </label>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button>Submit</button>
      </form>
    </div>
  );
};

export default Question;
