const goToActiveQuestion = () => {
  history.push(`/quizzes/${quiz.id}/questions/${responses[quizId].length}`);
};
