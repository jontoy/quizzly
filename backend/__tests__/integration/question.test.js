process.env.DATABASE_URL = "quizzly-test";

const app = require("../../app");
const request = require("supertest");
const db = require("../../db");

let testQuiz;
let testQuestion;

beforeAll(async function () {
  const result = await db.query(
    `INSERT INTO quizzes
                (name, difficulty)
                VALUES
                ($1, $2)
                RETURNING id, name, difficulty`,
    ["Quiz1", 3]
  );
  testQuiz = result.rows[0];
});
beforeEach(async function () {
  const result = await db.query(
    `INSERT INTO questions
                  (quiz_id, text, order_priority)
                  VALUES
                  ($1, $2, $3)
                  RETURNING question_id, quiz_id, text, order_priority`,
    [testQuiz.id, "test question1", 1]
  );
  testQuestion = result.rows[0];
});

afterEach(async function () {
  await db.query("DELETE FROM questions WHERE question_id = $1", [
    testQuestion.question_id,
  ]);
});

describe("GET /question", function () {
  let testQuestion2;
  beforeAll(async function () {
    const result = await db.query(
      `INSERT INTO questions
                      (quiz_id, text, order_priority)
                      VALUES
                      ($1, $2, $3)
                      RETURNING question_id, quiz_id, text, order_priority`,
      [testQuiz.id, "test question2", 2]
    );
    testQuestion2 = result.rows[0];
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
    await db.query(`DELETE FROM questions WHERE question_id = $1`, [
      testQuestion2.question_id,
    ]);
  });
});

describe("GET /question/:question_id", function () {
  let testOption;
  beforeEach(async function () {
    result = await db.query(
      `INSERT INTO options
                    (question_id, value, is_correct)
                    VALUES
                    ($1, $2, $3)
                    RETURNING option_id, question_id, value, is_correct`,
      [testQuestion.question_id, "option1", true]
    );
    testOption = result.rows[0];
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
    await db.query("DELETE FROM options WHERE option_id = $1", [
      testOption.option_id,
    ]);
  });
});

describe("POST /question", function () {
  let newQuestionId;
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
    newQuestionId = response.body.question.question_id;
    response = await request(app).get(`/question/${newQuestionId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.question).toEqual({
      ...newQuestion,
      question_id: newQuestionId,
      quiz: testQuiz,
      options: [],
    });
  });
  it("should return a 400 if fields are missing", async function () {
    const newQuestion = {
      text: "new question",
    };
    let response = await request(app).post(`/question`).send({ newQuestion });
    expect(response.statusCode).toEqual(400);
  });
  afterEach(async function () {
    await db.query("DELETE FROM questions WHERE question_id = $1", [
      newQuestionId,
    ]);
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
    let response = await request(app).delete(
      `/question/${testQuestion.question_id}`
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
  await db.query("DELETE FROM quizzes WHERE id = $1", [testQuiz.id]);
  db.end();
});
