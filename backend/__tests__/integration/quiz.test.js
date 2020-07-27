process.env.DATABASE_URL = "quizzly-test";

const app = require("../../app");
const request = require("supertest");
const db = require("../../db");

let testQuiz;

beforeEach(async function () {
  let result = await db.query(
    `INSERT INTO quizzes
            (name, difficulty)
            VALUES
            ($1, $2)
            RETURNING id, name, difficulty`,
    ["Quiz1", 3]
  );
  testQuiz = result.rows[0];
});

afterEach(async function () {
  await db.query("DELETE FROM quizzes WHERE id = $1", [testQuiz.id]);
});

describe("GET /quiz", function () {
  let testQuiz2;
  beforeAll(async function () {
    const result = await db.query(
      `INSERT INTO quizzes
        (name, difficulty)
        VALUES
        ($1, $2)
        RETURNING id, name, difficulty`,
      ["Quiz2", 5]
    );
    testQuiz2 = result.rows[0];
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
    await db.query(`DELETE FROM quizzes WHERE id = $1`, [testQuiz2.id]);
  });
});

describe("GET /quiz/:id", function () {
  let testQuestion;
  beforeEach(async function () {
    result = await db.query(
      `INSERT INTO questions
                    (quiz_id, text, order_priority)
                    VALUES
                    ($1, $2, $3)
                    RETURNING question_id, quiz_id, text, order_priority`,
      [testQuiz.id, "test question", 1]
    );
    testQuestion = result.rows[0];
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
    await db.query("DELETE FROM questions WHERE question_id = $1", [
      testQuestion.question_id,
    ]);
  });
});

describe("POST /quiz", function () {
  let newQuizId;
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
    newQuizId = response.body.quiz.id;
    response = await request(app).get(`/quiz/${newQuizId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.quiz).toEqual({
      ...newQuiz,
      id: newQuizId,
      questions: [],
    });
  });
  it("should return a 400 if fields are missing", async function () {
    const newQuiz = {
      name: "new quiz",
    };
    let response = await request(app).post(`/quiz`).send({ newQuiz });
    expect(response.statusCode).toEqual(400);
  });
  afterEach(async function () {
    await db.query("DELETE FROM quizzes WHERE id = $1", [newQuizId]);
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
    let response = await request(app).delete(`/quiz/${testQuiz.id}`);
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
