process.env.DATABASE_URL = "quizzly-test";

const app = require("../../app");
const request = require("supertest");
const db = require("../../db");
const Quiz = require("../../dataAccess/quiz");
const Question = require("../../dataAccess/question");
const Option = require("../../dataAccess/option");

let testQuiz;
let testQuestion;
let testOption;

beforeAll(async function () {
  testQuiz = await Quiz.create({ name: "Quiz1", difficulty: 3 });
  testQuestion = await Question.create({
    quiz_id: testQuiz.id,
    text: "test question1",
    order_priority: 1,
  });
});
beforeEach(async function () {
  testOption = await Option.create({
    question_id: testQuestion.question_id,
    value: "option1",
    is_correct: true,
  });
});

afterEach(async function () {
  await Option.delete(testOption.option_id);
});

describe("GET /option", function () {
  let testOption2;
  beforeAll(async function () {
    testOption2 = await Option.create({
      question_id: testQuestion.question_id,
      value: "option2",
      is_correct: false,
    });
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
    const newOptionId = response.body.option.option_id;
    response = await request(app).get(`/option/${newOptionId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.option).toEqual({
      ...newOption,
      option_id: newOptionId,
      question: testQuestion,
    });
    await Option.delete(newOptionId);
  });
  it("should return a 400 if fields are missing", async function () {
    const newOption = {
      value: "new option",
    };
    let response = await request(app).post(`/option`).send({ newOption });
    expect(response.statusCode).toEqual(400);
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
    const option = await Option.create({
      question_id: testQuestion.question_id,
      value: "delete me",
      is_correct: false,
    });
    let response = await request(app).delete(`/option/${option.option_id}`);
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
  await Question.delete(testQuestion.question_id);
  await Quiz.delete(testQuiz.id);
  db.end();
});
