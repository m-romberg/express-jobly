const { BadRequestError } = require("../expressError");

/**
 * sqlForPartialUpdate:
 *
 * Turns POJO object containing values to update in DB
 *
 * Returns an object containing a key with a sanitized database query
 * and a key of values to insert into database
 *
 * ACCEPTS:
 * {firstName: 'Aliya', age: 32}
 *
 * RETURNS:
 * {
    setCols: '"first_name"=$1, "age"=$2',
    values: ["Aliya", 32]
  }
 * @param {obj} dataToUpdate
 * @param {obj} jsToSql
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  //ex: keys = ["firstName", "lastName", "password", "email", "isAdmin"]

  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

function sqlForFiltering(dataFilters, jsToSql) {
  const keys = Object.keys(dataFilters);
  //ex: keys = ["nameLike", "minEmployees", "maxEmployees"]

  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataFilters),
  };
}

module.exports = { sqlForPartialUpdate };