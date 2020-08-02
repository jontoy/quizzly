import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="Navigation navbar-expand navbar navbar-dark bg-primary">
      <NavLink className="Navigation-link navbar-brand" to="/">
        Quizzly
      </NavLink>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <NavLink className="Navigation-link" to="/quizzes">
            Quizzes
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
