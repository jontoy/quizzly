# Quizzly

A quiz-taking application built using React + Redux frontend and Node.js + Express.js + PostgreSQL backend. The site allows a user to choose any quiz available in the database, progress through its associated questions, and see their resulting score at the end.

## Background

### The Problem

Quizzes serve several important roles in modern day society. For some, quizzes serve as a barometer for how well one truly understood previously studied material. For others, quizzes are a source of entertainment, a medium through which teams can show off their grasp of general-purpose trivia.

Regardless of its intended use, to be useful, a quiz should have the following:

- Questions with valid and invalid options
- A means of scoring the validity of a quiz-taker's responses
- Rapid turn-around in feedback to the user

As these required qualities play to the strong suit of software, the aim of this project is to create an automated platform where users can search for quizzes, take any they find interesting and see instantaneous feedback on how well they performed on any given quiz.

### The Solution

To tackle this problem, a RESTful backend API was created to serve quizzes, the questions associated with each quiz, and the options associated with each question.

The frontend utilizes requests to select API routes in several instances

- The quiz index route powers the searchable list of quizzes
- The quiz show route powers the details page on individual quizzes
- The question show route feeds into each questions page for individual quizzes
- A special quiz answers route provides the answers used to score and return completed quizzes on a results page.

Calls to API show routes are cached in the redux store along with user responses to reduce the total volume of API calls made. This along with the persistence of the redux store in localStorage creates a semi-permanent user experience.

The solution can be viewed in more detailed depth in the [frontend](https://github.com/jontoy/quizzly/tree/master/frontend) and the [backend](https://github.com/jontoy/quizzly/tree/master/backend) section READMEs.

## Getting Started

### Prerequisites

The following should be installed before attempting to setup a copy of this project.

```
Node.js (v11+)
PostgreSQL (v10.5+)
npm
```

### Installing

After cloning this repository:

```
cd backend
```

```
npm install
```

```
createdb quizzly
```

```
psql quizzly < data.sql
```

```
npm start
```

Will start the backend server.

While:

```
cd frontend
```

```
npm install
```

```
npm start
```

Will start the frontend application

## Deployment

This project currently has a deployed demo, with the [frontend on Netlify](https://jt-quizzly-frontend.netlify.app/) and the [backend on Heroku](https://jt-quizzly-backend.herokuapp.com/).

## Built With

### Frontend

- [React](https://reactjs.org/docs/getting-started.html) - UI Framework
- [Redux](https://redux.js.org/) - State Management

### Backend

- [Node.js](https://nodejs.org/en/) - The JavaScript Runtime
- [Express.js](https://expressjs.com/) - The Web Framework
- [PostgreSQL](https://www.postgresql.org/) - The Relational Database
