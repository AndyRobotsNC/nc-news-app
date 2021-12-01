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
      .then((res) => {
        const { body } = res;
        expect(body).toBeInstanceOf(Object);
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
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
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            topic: expect.any(String),
            author: expect.any(String),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("status 400: Bad article_id", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
  test("status 404: article_id not found", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("status 200: responds with the updated article", () => {
    const articleUpdate = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
            votes: 1,
            topic: expect.any(String),
            author: expect.any(String),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("status 400: missing required fields", () => {
    const articleUpdate = {};
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("malformed body/missing required fields");
      });
  });
  test("status 400: malformed body", () => {
    const articleUpdate = { inc_votes: "banana" };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("malformed body/missing required fields");
      });
  });
});
describe("GET /api/articles", () => {
  test("status 200: returns an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { body } = res;
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("status 404: responds with an error message when passed an invalid path", () => {
    return request(app)
      .get("/api/articels")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid path");
      });
  });
  describe("GET /api/articles?sort_by=&&order_by=&&topic=", () => {
    test("status 200: returns a sorted and ordered array", () => {
      return request(app)
        .get("/api/articles?sort_by=title&&order_by=asc")
        .expect(200)
        .then((res) => {
          const { body } = res;
          expect(body).toBeInstanceOf(Object);
          expect(body.articles).toHaveLength(12);
          expect(body.articles[0]).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "A",
              article_id: 6,
              topic: "mitch",
              created_at: "2020-10-18T02:00:00.000Z",
              votes: 0,
              comment_count: 1,
            })
          );
        });
    });
    test("status 200: defaults sorted_by date and descending", () => {
      return request(app)
        .get("/api/articles?sort_by=profile&&order_by=a")
        .expect(200)
        .then((res) => {
          const { body } = res;
          expect(body).toBeInstanceOf(Object);
          expect(body.articles).toHaveLength(12);
          expect(body.articles[0]).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              topic: "mitch",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
              comment_count: 2,
            })
          );
        });
    });
    test("status 200: returns an array of the chosen topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((res) => {
          const { body } = res;
          expect(body).toBeInstanceOf(Object);
          expect(body.articles).toHaveLength(11);
        });
    });
    test("status 404: responds with an error message when topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=cars")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Topic not found");
        });
    });
  });
});

afterAll(() => db.end());
