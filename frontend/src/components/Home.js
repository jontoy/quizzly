import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="Home jumbotron">
      <h1 className="display-4">Quizzly</h1>
      <p className="lead">All your favorite quizzes, collected in one place!</p>
      <Link className="btn btn-info" to="/quizzes">
        Find a Quiz!
      </Link>
    </div>
  );
};

export default Home;
