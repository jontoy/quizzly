process.env.DATABASE_URL = "quizzly-test";

const app = require("../../app");
const request = require("supertest");
const db = require("../../db");
const Quiz = require("../../dataAccess/quiz");
const Question = require("../../dataAccess/question");

let testQuiz;

beforeEach(async function () {
  testQuiz = await Quiz.create({ name: "Quiz1", difficulty: 3 });
});

afterEach(async function () {
  await Quiz.delete(testQuiz.id);
});

describe("GET /quiz", function () {
  let testQuiz2;
  beforeAll(async function () {
    testQuiz2 = await Quiz.create({ name: "Quiz2", difficulty: 5 });
  });

  it("should return list of all quizzes when given no parameters", async function () {
    const response = await request(app).get("/quiz");
    expect(response.statusCode).toEqual(200);
    expect(response.body.quizzes).toEqual(
      expect.arrayContaining([testQuiz, testQuiz2])
    );
  });

  it("should filter by name when passed a search parameter", async function () {
    const response = await request(app).get("/quiz?name=quiz2");
    expect(response.statusCode).toEqual(200);
    expect(response.body.quizzes).toEqual(expect.arrayContaining([testQuiz2]));
    expect(response.body.quizzes).not.toEqual(
      expect.arrayContaining([testQuiz])
    );
  });
  it("should appropriately filter by min_difficulty", async function () {
    const response = await request(app).get("/quiz?min_difficulty=4");
    expect(response.statusCode).toEqual(200);
    expect(response.body.quizzes).toEqual(expect.arrayContaining([testQuiz2]));
    expect(response.body.quizzes).not.toEqual(
      expect.arrayContaining([testQuiz])
    );
  });
  it("should appropriately filter by max_difficulty", async function () {
    const response = await request(app).get("/quiz?max_difficulty=4");
    expect(response.statusCode).toEqual(200);
    expect(response.body.quizzes).toEqual(expect.arrayContaining([testQuiz]));
    expect(response.body.quizzes).not.toEqual(
      expect.arrayContaining([testQuiz2])
    );
  });
  it("should appropriately filter by min & max difficulty", async function () {
    const response = await request(app).get(
      "/quiz?min_difficulty=4&max_difficulty=6"
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body.quizzes).toEqual(expect.arrayContaining([testQuiz2]));
    expect(response.body.quizzes).not.toEqual(
      expect.arrayContaining([testQuiz])
    );
  });
  it("should throw an error if min_difficulty > max_difficulty", async function () {
    const response = await request(app).get(
      "/quiz?min_difficulty=6&max_difficulty=4"
    );
    expect(response.statusCode).toEqual(400);
  });
  afterAll(async function () {
    await Quiz.delete(testQuiz2.id);
  });
});

describe("GET /quiz/:id", function () {
  let testQuestion;
  beforeEach(async function () {
    testQuestion = await Question.create({
      quiz_id: testQuiz.id,
      text: "test question",
      order_priority: 1,
    });
  });
  it("should return detailed information on a single quiz", async function () {
    const response = await request(app).get(`/quiz/${testQuiz.id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.quiz).toEqual({
      ...testQuiz,
      questions: [testQuestion],
    });
  });

  it("should return a 404 if given an invalid id", async function () {
    const response = await request(app).get(
      "/quiz/00000000-0000-0000-0000-000000000000"
    );
    expect(response.statusCode).toEqual(404);
  });
  afterEach(async function () {
    await Question.delete(testQuestion.question_id);
  });
});

describe("POST /quiz", function () {
  it("should create a new quiz", async function () {
    const newQuiz = {
      name: "new quiz",
      difficulty: 10,
    };
    let response = await request(app)
      .post(`/quiz`)
      .send({ ...newQuiz });
    expect(response.statusCode).toEqual(201);
    expect(response.body.quiz).toEqual({ ...newQuiz, id: expect.any(String) });
    const newQuizId = response.body.quiz.id;
    response = await request(app).get(`/quiz/${newQuizId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.quiz).toEqual({
      ...newQuiz,
      id: newQuizId,
      questions: [],
    });
    await Quiz.delete(newQuizId);
  });
  it("should return a 400 if fields are missing", async function () {
    const newQuiz = {
      name: "new quiz",
    };
    let response = await request(app).post(`/quiz`).send({ newQuiz });
    expect(response.statusCode).toEqual(400);
  });
});

describe("PATCH /quiz/:id", function () {
  it("should modify an existing quiz", async function () {
    const newQuiz = {
      name: "updated quiz",
      difficulty: 17,
    };
    let response = await request(app)
      .patch(`/quiz/${testQuiz.id}`)
      .send(newQuiz);
    expect(response.statusCode).toEqual(200);
    expect(response.body.quiz).toEqual({ ...testQuiz, ...newQuiz });
    response = await request(app).get(`/quiz/${testQuiz.id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.quiz).toEqual({
      ...testQuiz,
      ...newQuiz,
      questions: [],
    });
  });

  it("should return a 404 if id is invalid", async function () {
    const newQuiz = {
      name: "updated quiz",
      difficulty: 17,
    };
    let response = await request(app)
      .patch(`/quiz/00000000-0000-0000-0000-000000000000`)
      .send(newQuiz);
    expect(response.statusCode).toEqual(404);
  });
});

describe("DELETE /quiz/:id", function () {
  it("should delete an existing quiz", async function () {
    const quiz = await Quiz.create({ name: "delete me", difficulty: 11 });
    let response = await request(app).delete(`/quiz/${quiz.id}`);
    expect(response.statusCode).toEqual(200);
  });
  it("should return a 404 if id is invalid", async function () {
    let response = await request(app).delete(
      `/quiz/00000000-0000-0000-0000-000000000000`
    );
    expect(response.statusCode).toEqual(404);
  });
});

afterAll(function () {
  db.end();
});
