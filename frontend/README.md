# Quizzly Frontend

The frontend UI for the Quizzly app built using React.js + Redux.js. Via queries to the backend Quizzly API it allows users to browse available quizzes, view the details/progress on any individual quiz, take a quiz and see instantaneous color coded results of a completed quiz.

## Built With

- [React](https://reactjs.org/docs/getting-started.html) - UI Framework
- [React-Router](https://reactrouter.com/) - Route Management
- [Redux](https://redux.js.org/) - State Management
- [Redux-Persist](https://www.npmjs.com/package/redux-persist) - Persists Redux Store
- [Bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction/) - UI Styling
- [Font-Awesome](https://fontawesome.com/) - UI Icons

## User Flow

1. Welcome page (`/`). Prompt directs user to {2}.
2. Quiz Index page (`/quizzes`). User can filter by quiz name using the searchbox. Clicking any quiz card directs to {3}.
3. Quiz Details page (`/quizzes/[id]`). Displays more detailed information on a quiz including current progress and total questions. If there is no progress directs to {4} at question 0. If there is partial progress, directs to {4} for the furthest unanswered question. If the quiz is complete, directs to {5}.
4. Quiz Question page (`/quizzes/[id]/[questionNumber]`). Displays multiple choice options for question. On submission directs to {4} for the furthese unanswered question or {5} if the last question. Clicking "Previous" directs to {4} with the previous question number or {3} if question 0. Clicking "Next" directs to {4} with the next question number or {5} if the last question.
5. Quiz Results page (`/quizzes/[id]/results`). Grades quiz based on submitted answers and displays color coded results. Directs to {2} as well as {3} through the progress reset button.

The first time a user visits {3} or {4} a resource is requested from the API and cached in the redux store. Every subsequent visit will pull from the cache.

## Notable Design Choices

In an effort to reduce calls to the API, caching for visited quiz/question data was introduced. As the user is allowed to retry quizzes as many times as they wish, there would have been many duplicated requests to the API for these resources. As the quiz index results vary considerably with the search options, caching was not implemented for these results. Another consideration against caching quiz index results was the size implications if the volume of quizzes grew large, though this could be mitigated through pagination.

Responses are stored in the redux as an array of option IDs. This allows a user to skip questions and potentially fill them in out of order, as any non-answered questions will simply result in an `undefined` value at their associated index in the response array. This also allows one to determine the furthest question reached using the length of the response array. The one potential edge case to consider when using this as a proxy for the "Next Question" is a scenario in which a user skips question 1 & 2, answers question 3, then goes back and answers question 1. The logical next question would be question 2, but by this metric the next question would be question 4.

Information regarding the true/false value of options is purposely excluded from the redux store to prevent user inspection using the redux dev tools. A future improvement would be to remove the array of valid option IDs for each question from the local state of the Quiz Results component, as these too can be spied on by a knowledgable user utilizing react dev tools.

The redux store is persisted in localStorage using redux-persist. This allows for a semi-permanent user to be established, as the user will be able to maintain their various quiz progresses whenever they return to the site.

Filtering quizzes for the index page is primarily a backend implementation. The search box UI controls the search term of the associated call to the API to filter results. This could have alternatively been implemented by requesting all results and filtering them on the frontend. This would have resulted in a slightly more responsive UI experience, but would not have scaled as well.

## Future Areas of Improvement

- Paginate quiz index results on either the frontend or backend
- Rework logic to no longer store quiz answers in Quiz Results component local state. This could involve introducing a new API endpoint for scoring question submissions.
- Implement a more permanent user, either through allowing users to create accounts or by automatically assigning unrecognized IP addresses a user ID to be stored in local storage. This would allow expanded, community-centric quiz features such as leaderboards and sorting quizzes by their popularity as well as time-centric features like a score history by quiz/quiz category.
