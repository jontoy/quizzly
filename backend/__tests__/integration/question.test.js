process.env.DATABASE_URL = "quizzly-test";

const app = require("../../app");
const request = require("supertest");
const db = require("../../db");
const Quiz = require("../../dataAccess/quiz");
const Question = require("../../dataAccess/question");
const Option = require("../../dataAccess/option");

let testQuiz;
let testQuestion;

beforeAll(async function () {
  testQuiz = await Quiz.create({ name: "Quiz1", difficulty: 3 });
});
beforeEach(async function () {
  testQuestion = await Question.create({
    quiz_id: testQuiz.id,
    text: "test question1",
    order_priority: 1,
  });
});

afterEach(async function () {
  await Question.delete(testQuestion.question_id);
});

describe("GET /question", function () {
  let testQuestion2;
  beforeAll(async function () {
    testQuestion2 = await Question.create({
      quiz_id: testQuiz.id,
      text: "test question2",
      order_priority: 2,
    });
  });

  it("should return list of all questions when given no parameters", async function () {
    const response = await request(app).get("/question");
    expect(response.statusCode).toEqual(200);
    console.log(response.body.questions);
    expect(response.body.questions).toEqual(
      expect.arrayContaining([testQuestion, testQuestion2])
    );
  });

  it("should filter by text when passed a search parameter", async function () {
    const response = await request(app).get("/question?text=question1");
    expect(response.statusCode).toEqual(200);
    expect(response.body.questions).toEqual(
      expect.arrayContaining([testQuestion])
    );
    expect(response.body.questions).not.toEqual(
      expect.arrayContaining([testQuestion2])
    );
  });
  it("should appropriately filter by quiz_id", async function () {
    const response = await request(app).get(`/question?quiz_id=${testQuiz.id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.questions).toEqual([testQuestion, testQuestion2]);
  });
  afterAll(async function () {
    await Question.delete(testQuestion2.question_id);
  });
});

describe("GET /question/:question_id", function () {
  let testOption;
  beforeEach(async function () {
    testOption = await Option.create({
      question_id: testQuestion.question_id,
      value: "option1",
      is_correct: true,
    });
  });
  it("should return detailed information on a single question", async function () {
    const response = await request(app).get(
      `/question/${testQuestion.question_id}`
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body.question).toEqual({
      ...testQuestion,
      quiz: testQuiz,
      options: [testOption],
    });
  });

  it("should return a 404 if given an invalid id", async function () {
    const response = await request(app).get(
      "/question/00000000-0000-0000-0000-000000000000"
    );
    expect(response.statusCode).toEqual(404);
  });
  afterEach(async function () {
    await Option.delete(testOption.option_id);
  });
});

describe("POST /question", function () {
  it("should create a new question", async function () {
    const newQuestion = {
      quiz_id: testQuiz.id,
      text: "new question",
      order_priority: 6,
    };
    let response = await request(app).post(`/question`).send(newQuestion);
    expect(response.statusCode).toEqual(201);
    expect(response.body.question).toEqual({
      ...newQuestion,
      question_id: expect.any(String),
    });
    const newQuestionId = response.body.question.question_id;
    response = await request(app).get(`/question/${newQuestionId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.question).toEqual({
      ...newQuestion,
      question_id: newQuestionId,
      quiz: testQuiz,
      options: [],
    });
    await Question.delete(newQuestionId);
  });
  it("should return a 400 if fields are missing", async function () {
    const newQuestion = {
      text: "new question",
    };
    let response = await request(app).post(`/question`).send({ newQuestion });
    expect(response.statusCode).toEqual(400);
  });
});

describe("PATCH /question/:id", function () {
  it("should modify an existing question", async function () {
    const newQuestion = {
      text: "updated question",
      order_priority: 17,
    };
    let response = await request(app)
      .patch(`/question/${testQuestion.question_id}`)
      .send(newQuestion);
    expect(response.statusCode).toEqual(200);
    expect(response.body.question).toEqual({ ...testQuestion, ...newQuestion });
    response = await request(app).get(`/question/${testQuestion.question_id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.question).toEqual({
      ...testQuestion,
      ...newQuestion,
      quiz: testQuiz,
      options: [],
    });
  });

  it("should return a 404 if id is invalid", async function () {
    const newQuestion = {
      text: "updated question",
      order_priority: 17,
    };
    let response = await request(app)
      .patch(`/question/00000000-0000-0000-0000-000000000000`)
      .send(newQuestion);
    expect(response.statusCode).toEqual(404);
  });
});

describe("DELETE /question/:id", function () {
  it("should delete an existing question", async function () {
    const question = await Question.create({
      quiz_id: testQuiz.id,
      text: "delete me",
      order_priority: 4,
    });
    let response = await request(app).delete(
      `/question/${question.question_id}`
    );
    expect(response.statusCode).toEqual(200);
  });
  it("should return a 404 if id is invalid", async function () {
    let response = await request(app).delete(
      `/question/00000000-0000-0000-0000-000000000000`
    );
    expect(response.statusCode).toEqual(404);
  });
});

afterAll(async function () {
  await Quiz.delete(testQuiz.id);
  db.end();
});
