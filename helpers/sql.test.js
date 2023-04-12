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
})