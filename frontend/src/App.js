import React, { useState } from "react";
import Navigation from "./Navigation";
import Routes from "./Routes";
import QuizContext from "./quizContext";
import "./App.css";

function App() {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(null);

  return (
    <QuizContext.Provider
      value={{
        currentQuiz,
        setCurrentQuiz,
        currentQuestionNumber,
        setCurrentQuestionNumber,
      }}
    >
      <div className="App">
        <Navigation />
        <Routes />
      </div>
    </QuizContext.Provider>
  );
}

export default App;
