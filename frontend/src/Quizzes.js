import React, { useState, useEffect } from "react";
import QuizzlyApi from "./QuizzlyApi";
import Searchbox from "./Searchbox";
import QuizList from "./QuizList";

const Quizzes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    async function getQuizzes() {
      let allQuizzes = await QuizzlyApi.getQuizzes({ name: searchTerm });
      setQuizzes(allQuizzes);
    }
    getQuizzes();
    setIsLoading(false);
  }, [searchTerm]);
  if (isLoading) {
    return <p>Loading &hellip;</p>;
  }

  return (
    <div className="Quizzes container">
      <Searchbox filterResults={setSearchTerm} />
      <QuizList quizzes={quizzes} />
    </div>
  );
};

export default Quizzes;
