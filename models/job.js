"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Job {

  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ title, salary, equity, companyHandle }) {
    // const duplicateCheck = await db.query(
    //   `SELECT handle
    //        FROM companies
    //        WHERE handle = $1`,
    //   [handle]);

    // if (duplicateCheck.rows[0])
    //   throw new BadRequestError(`Duplicate company: ${handle}`);

    const result = await db.query(
      `INSERT INTO jobs(
          title,
          salary,
          equity,
          company_handle)
           VALUES
             ($1, $2, $3, $4, $5)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [
        title,
        salary,
        equity,
        companyHandle,
      ],
    );
    const company = result.rows[0];

    return company;
  }

  /**
 * _filterQueryString:
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

  static _filterQueryString(dataFilters, jsToSql) {
    console.log("dataFilters", dataFilters);
    const keys = Object.keys(dataFilters);
    console.log("keys", keys);
    //ex: keys = ["nameLike", "minEmployees", "maxEmployees"]


    //Does not have to be in for loop... we do know how many we will be getting
    const whereClauseComponents = [];
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === "minEmployees") {
        whereClauseComponents.push(`${jsToSql[keys[i]]} >= $${i + 1}`);
      }
      if (keys[i] === "maxEmployees") {
        whereClauseComponents.push(`${jsToSql[keys[i]]} <= $${i + 1}`);
      }
      if (keys[i] === "nameLike") {
        whereClauseComponents.push(`${jsToSql[keys[i]]} ILIKE $${i + 1}`);
        console.log("dataFilters.nameLike", dataFilters.nameLike);
        dataFilters.nameLike = `%${dataFilters.nameLike}%`;
      }
    }

    if (whereClauseComponents.length === 0) {
      return {
        filterCols: '',
        values: Object.values(dataFilters),
      };
    }

    return {
      filterCols: `WHERE ` + whereClauseComponents.join(" AND "),
      values: Object.values(dataFilters),
    };
  }

  /** Find all companies.
   * Takes optional object containing cols and values to filter search
   * {minEmployees: 3, maxEmployees: 5, nameLike: rick}
   *
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */

  static async findAll(data = {}) {

    if (data.minEmployees > data.maxEmployees) {
      throw new BadRequestError(
        "minEmployees cannot be greater than maxEmployees"
      );
    }

    console.log("data inside findall", data);
    const { filterCols, values } = Company._filterQueryString(
      data, {
      nameLike: "name",
      minEmployees: "num_employees",
      maxEmployees: "num_employees",
    });

    console.log("filtercols", filterCols, "values inside findall", values);

    const querySql = `SELECT handle,
                              name,
                              description,
                              num_employees AS "numEmployees",
                              logo_url AS "logoUrl"
                          FROM companies
                          ${filterCols}
                          ORDER BY name`;
    const companiesRes = await db.query(querySql, values);

    console.log("query inside findall", querySql);


    return companiesRes.rows;
  }


  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const companyRes = await db.query(
      `SELECT handle,
                name,
                description,
                num_employees AS "numEmployees",
                logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`,
      [handle]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE companies
      SET ${setCols}
        WHERE handle = ${handleVarIdx}
        RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
      `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
      [handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}