import React from "react";
import { Link } from "react-router-dom";
import QuizCard from "./QuizCard";

const QuizList = ({ quizzes }) => {
  return (
    <ul className="QuizList list-unstyled">
      {quizzes.map(({ id, name, difficulty }) => (
        <li key={id}>
          <Link to={`/quizzes/${id}`}>
            <QuizCard id={id} name={name} difficulty={difficulty} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default QuizList;
