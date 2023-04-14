"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "testWorker",
    salary: "23,000",
    equity: "0.012",
    companyHandle: "c2"
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);
  });

  test("bad request with no data", async function () {
    try{
      await Job.create({});
      throw new Error("fail test, you shouldn't get here")
    } catch(err){
      expect(err).toBeInstanceOf(BadRequestError);
    }
  })
});
/************************************** findAll */
/************************************** get */
/************************************** update */
/************************************** remove */