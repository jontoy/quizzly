import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Question from "./Question";
import Home from "./Home";
import Quizzes from "./Quizzes";
import Quiz from "./Quiz";
import QuizResult from "./QuizResult";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/quizzes/:quizId/questions/:questionNumber">
        <Question />
      </Route>
      <Route exact path="/quizzes/:quizId/results">
        <QuizResult />
      </Route>
      <Route exact path="/quizzes/:quizId">
        <Quiz />
      </Route>
      <Route exact path="/quizzes">
        <Quizzes />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
