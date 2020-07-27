process.env.DATABASE_URL = "quizzly-test";

const app = require("../../app");
const request = require("supertest");
const db = require("../../db");

let testQuiz;
let testQuestion;
let testOption;

beforeAll(async function () {
  let result = await db.query(
    `INSERT INTO quizzes
                (name, difficulty)
                VALUES
                ($1, $2)
                RETURNING id, name, difficulty`,
    ["Quiz1", 3]
  );
  testQuiz = result.rows[0];
  result = await db.query(
    `INSERT INTO questions
                  (quiz_id, text, order_priority)
                  VALUES
                  ($1, $2, $3)
                  RETURNING question_id, quiz_id, text, order_priority`,
    [testQuiz.id, "test question1", 1]
  );
  testQuestion = result.rows[0];
});
beforeEach(async function () {
  const result = await db.query(
    `INSERT INTO options
                  (question_id, value, is_correct)
                  VALUES
                  ($1, $2, $3)
                  RETURNING option_id, question_id, value, is_correct`,
    [testQuestion.question_id, "option1", true]
  );
  testOption = result.rows[0];
});

afterEach(async function () {
  await db.query("DELETE FROM options WHERE option_id = $1", [
    testOption.option_id,
  ]);
});

describe("GET /option", function () {
  let testOption2;
  beforeAll(async function () {
    const result = await db.query(
      `INSERT INTO options
                      (question_id, value, is_correct)
                      VALUES
                      ($1, $2, $3)
                      RETURNING option_id, question_id, value, is_correct`,
      [testQuestion.question_id, "test option2", false]
    );
    testOption2 = result.rows[0];
  });

  it("should return list of all options when given no parameters", async function () {
    const response = await request(app).get("/option");
    expect(response.statusCode).toEqual(200);
    expect(response.body.options).toEqual(
      expect.arrayContaining([testOption, testOption2])
    );
  });

  it("should filter by value when passed a search parameter", async function () {
    const response = await request(app).get("/option?value=option1");
    expect(response.statusCode).toEqual(200);
    expect(response.body.options).toEqual(expect.arrayContaining([testOption]));
    expect(response.body.options).not.toEqual(
      expect.arrayContaining([testOption2])
    );
  });
  it("should appropriately filter by question_id", async function () {
    const response = await request(app).get(
      `/option?question_id=${testQuestion.question_id}`
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body.options).toEqual([testOption, testOption2]);
  });
  it("should appropriately filter by is_correct", async function () {
    const response = await request(app).get(`/option?is_correct=false`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.options).toEqual(
      expect.arrayContaining([testOption2])
    );
    expect(response.body.options).not.toEqual(
      expect.arrayContaining([testOption])
    );
  });
  afterAll(async function () {
    await db.query(`DELETE FROM options WHERE option_id = $1`, [
      testOption2.option_id,
    ]);
  });
});

describe("GET /option/:option_id", function () {
  it("should return detailed information on a single option", async function () {
    const response = await request(app).get(`/option/${testOption.option_id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.option).toEqual({
      ...testOption,
      question: testQuestion,
    });
  });

  it("should return a 404 if given an invalid id", async function () {
    const response = await request(app).get(
      "/option/00000000-0000-0000-0000-000000000000"
    );
    expect(response.statusCode).toEqual(404);
  });
});

describe("POST /option", function () {
  let newOptionId;
  it("should create a new option", async function () {
    const newOption = {
      question_id: testQuestion.question_id,
      value: "new option",
      is_correct: false,
    };
    let response = await request(app).post(`/option`).send(newOption);
    expect(response.statusCode).toEqual(201);
    expect(response.body.option).toEqual({
      ...newOption,
      option_id: expect.any(String),
    });
    newOptionId = response.body.option.option_id;
    response = await request(app).get(`/option/${newOptionId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.option).toEqual({
      ...newOption,
      option_id: newOptionId,
      question: testQuestion,
    });
  });
  it("should return a 400 if fields are missing", async function () {
    const newOption = {
      value: "new option",
    };
    let response = await request(app).post(`/option`).send({ newOption });
    expect(response.statusCode).toEqual(400);
  });
  afterEach(async function () {
    await db.query("DELETE FROM options WHERE option_id = $1", [newOptionId]);
  });
});

describe("PATCH /option/:id", function () {
  it("should modify an existing option", async function () {
    const newOption = {
      value: "updated option",
      is_correct: false,
    };
    let response = await request(app)
      .patch(`/option/${testOption.option_id}`)
      .send(newOption);
    expect(response.statusCode).toEqual(200);
    expect(response.body.option).toEqual({ ...testOption, ...newOption });
    response = await request(app).get(`/option/${testOption.option_id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.option).toEqual({
      ...testOption,
      ...newOption,
      question: testQuestion,
    });
  });

  it("should return a 404 if id is invalid", async function () {
    const newOption = {
      value: "updated option",
      is_correct: false,
    };
    let response = await request(app)
      .patch(`/option/00000000-0000-0000-0000-000000000000`)
      .send(newOption);
    expect(response.statusCode).toEqual(404);
  });
});

describe("DELETE /option/:id", function () {
  it("should delete an existing option", async function () {
    let response = await request(app).delete(`/option/${testOption.option_id}`);
    expect(response.statusCode).toEqual(200);
  });
  it("should return a 404 if id is invalid", async function () {
    let response = await request(app).delete(
      `/option/00000000-0000-0000-0000-000000000000`
    );
    expect(response.statusCode).toEqual(404);
  });
});

afterAll(async function () {
  await db.query("DELETE FROM questions WHERE question_id = $1", [
    testQuestion.question_id,
  ]);
  await db.query("DELETE FROM quizzes WHERE id = $1", [testQuiz.id]);
  db.end();
});
