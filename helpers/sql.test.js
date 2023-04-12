const { BadRequestError } = require("../expressError");
const {sqlForPartialUpdate} = require("./sql");

describe("sqlForPartialUpdate", function () {
  test("working", function () {
    const dataToUpdate = {firstName: 'Aliya', age: 32};
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    }
    const sanitizedSqlObj = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(sanitizedSqlObj).toEqual(
      {
        setCols: '"first_name"=$1, "age"=$2',
        values: ["Aliya", 32]
      }
    );
  });

  test("fails no data passed", function () {
    const dataToUpdate = {};

    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    }

    try {
      sqlForPartialUpdate(dataToUpdate, jsToSql);
    } catch(err) {
      expect(err).toBeInstanceOf(BadRequestError)
    }
  });
})

describe("sqlForFiltering", function () {
  test("working", function () {
    const dataFilters = {nameLike: 'rick', minEmployees: 225, maxEmployees: 300};
    const jsToSql = {
      nameLike: "name",
      minEmployees: "num_employees",
      maxEmployees: "num_employees"
    }
    const sanitizedSqlObj = sqlForFiltering(dataFilters, jsToSql);

    expect(sanitizedSqlObj).toEqual(
      {
        filterCols: `WHERE "name" ILIKE $1
                  AND num_employees > $2
                  AND num_employees < $3`,
        values: ["%rick%", 225, 300]
      }
    );
  });

  // test("fails no data passed", function () {
  //   const dataToUpdate = {};

  //   const jsToSql = {
  //     firstName: "first_name",
  //     lastName: "last_name",
  //     isAdmin: "is_admin",
  //   }

  //   try {
  //     sqlForPartialUpdate(dataToUpdate, jsToSql);
  //   } catch(err) {
  //     expect(err).toBeInstanceOf(BadRequestError)
  //   }
  // });
})