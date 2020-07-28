import { useHistory } from "react-router-dom";

const history = useHistory();
const goToActiveQuestion = (quizId, responses) => {
  history.push(`/quizzes/${quizId}/questions/${responses[quizId].length}`);
};

export default goToActiveQuestion;
