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
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(3);
        body.forEach((topic) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test('status 404: responds with an error message when passed an invalid path"', () => {
    return request(app)
      .get("/api/toopics")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid path");
      });
  });
});

afterAll(() => db.end());
