const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("status 200: returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toBeInstanceOf(Object);
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
          console.log(body);
        });
      });
  });
  test("status 404: responds with an error message when passed an invalid path", () => {
    return request(app)
      .get("/api/toopics")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid path");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("status 200: returns the requested article", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toBeInstanceOf(Object);
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
        });
      });
  });
});

afterAll(() => db.end());
