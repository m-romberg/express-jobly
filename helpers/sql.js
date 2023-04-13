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

/**
 * sqlForFilter:
 *
 * Turns POJO object containing values to filter by in DB
 *
 * Returns an object containing a key with a sanitized database WHERE query
 * and a key of values to filter by in database
 *
 * ACCEPTS:
 * {maxEmployees: 32}
 *
 * RETURNS:
 * {
    filterCols: 'WHERE "num_employees" < $1',
    values: [32]
  }
 * @param {obj} dataToUpdate
 * @param {obj} jsToSql
 */

function sqlForFiltering(dataFilters, jsToSql) {
  const keys = Object.keys(dataFilters);
  //ex: keys = ["nameLike", "minEmployees", "maxEmployees"]

  if (keys.length === 0) throw new BadRequestError("No Filters");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const queriesArr = [];
  for (let i=0; i < keys.length; i++){
    if (keys[i] === "minEmployees"){
      queriesArr.push(`"${jsToSql[keys[i]]}" > $${i+1}`);
    }
    if (keys[i] === "maxEmployees"){
      queriesArr.push(`"${jsToSql[keys[i]]}" < $${i+1}`);
    }
    if (keys[i] === "nameLike"){
      queriesArr.push(`"${jsToSql[keys[i]]}" ILIKE $${i+1}`);
      dataFilters.nameLike = `%${dataFilters.nameLike}%`;
    }
  }


  return {
    filterCols: `WHERE ` + queriesArr.join(" AND "),
    values: Object.values(dataFilters),
  };
}

module.exports = { sqlForPartialUpdate, sqlForFiltering };