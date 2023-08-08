process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
const fs = require("fs");
const { readDataFromFile, writeDataToFile } = require("./items"); // Import the file helpers

// Mock the file system operations
jest.mock("fs");
const pickles = [{ name: "pickles", price: 6.25 }];

beforeEach(function() {
  fs.readFileSync.mockReturnValueOnce(JSON.stringify(pickles));
});

// end afterEach

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /items", function() {
  test("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({items: pickles});
  });
});
// end

/** GET /items/[name] - return data about one item: `{item: {item}}` */

describe("GET /items/:name", function() {
  test("Gets a single item", async function() {
    debugger;
    const resp = await request(app).get(`/items/${pickles[0].name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({ foundItem: pickles[0] });
  });

  test("Responds with 404 if can't find item", async function() {
    const resp = await request(app).get(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** POST /items - create item from data; return `{item: {item}}` */

describe("POST /items", function() {
  test("Creates a new item", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "popsicle",
        price: 4.50
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      added: { name: "popsicle", price: 4.50 }
    });
  });
});
// end

/** PATCH /items/[name] - update item; return `{item: {newItem}}` */

describe("PATCH /items/:name", function() {
  test("Updates a single item", async function() {
    const resp = await request(app)
      .patch(`/items/${pickles[0].name}`)
      .send({
        name: "oranges",
        price: 3.75
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      foundItem: { name: "oranges", price: 3.75 }
    });
  });

  test("Responds with 404 if id invalid", async function() {
    const resp = await request(app).patch(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** DELETE /items/[name] - delete item,
 *  return `{message: "Item deleted"}` */

describe("DELETE /items/:name", function() {
  test("Deletes a single a item", async function() {
    const resp = await request(app).delete(`/items/${pickles[0].name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
// end
