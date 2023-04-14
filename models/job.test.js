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
    companyHandle: "c2",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);
  });

  test("bad request with no data", async function () {
    try {
      await Job.create({});
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
    }
  });
});

// ('Worker1', '10,000', '0.003', 'c1'),
//               ('Worker2', '12,000', '0.025', 'c1'),
//               ('BigWorker', '45,000', '0.012', 'c3'),
//               ('BigWorker2', '25,000', '0.008, 'c2')

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: any(Number),
        title: "Worker1",
        salary: "10,000",
        equity: "0.003",
        companyHandle: "c1",
      },
      {
        id: any(Number),
        title: "Worker2",
        salary: "12,000",
        equity: "0.025",
        companyHandle: "c1",
      },
      {
        id: any(Number),
        title: "BigWorker",
        salary: "45,000",
        equity: "0.012",
        companyHandle: "c3",
      },
      {
        id: any(Number),
        title: "BigWorker2",
        salary: "25,000",
        equity: "0.008",
        companyHandle: "c2",
      },
    ]);
  });

  test("works: filter title", async function() {
    const filter = { title: "big"};
    const jobs = await Job.findAll(filter);
    expect(jobs).toEqual([
      {
        id: any(Number),
        title: "BigWorker",
        salary: "45,000",
        equity: "0.012",
        companyHandle: "c3",
      },
      {
        id: any(Number),
        title: "BigWorker2",
        salary: "25,000",
        equity: "0.008",
        companyHandle: "c2",
      },
    ])
  })
});
/************************************** get */
/************************************** update */
/************************************** remove */
