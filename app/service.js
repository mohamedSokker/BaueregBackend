const { getData } = require("../functions/getData");
const { eventEmitter } = require("./subscribe");
const { model } = require("./Model");
// const { TestSchema } = require("./schema");
const {
  validateAddData,
  validateManyAdd,
  validateupdateData,
  validateManyUpdate,
} = require("./validation");

const getTableData = async (table) => {
  try {
    const getquery = `SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('${table}')`;
    const data = (await getData(getquery)).recordsets[0];
    let result = {};
    data.map((d) => {
      result[d.name] = {};
    });
    console.log(result);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

getTableData("AppMaintUsers");

const createTable = async (table, schema) => {
  try {
    let query = `CREATE TABLE ${table} (`;
    Object.keys(schema).map((item) => {
      query += `${item} ${schema[item].databaseType},`;
    });
    query = query.slice(0, -1);
    query += ")";
    await getData(query);
    return `Success`;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllData = async (table) => {
  try {
    if (!model[table]) {
      console.log(`From Database`);
      const query = `SELECT * FROM ${table}`;
      const result = (await getData(query)).recordsets[0];
      model[table] = result;
      const size = Buffer.byteLength(JSON.stringify(model));
      const sizeKB = Buffer.byteLength(JSON.stringify(model)) / 1024;
      const sizeMB = sizeKB / 1024;
      console.log(
        `${size} byte`,
        `${sizeKB.toFixed(2)} KB`,
        `${sizeMB.toFixed(2)} MB`
      );
      console.log(table);
      return result;
    } else {
      console.log(`From Model`);
      const size = Buffer.byteLength(JSON.stringify(model));
      const sizeKB = Buffer.byteLength(JSON.stringify(model)) / 1024;
      const sizeMB = sizeKB / 1024;
      console.log(
        `${size} byte`,
        `${sizeKB.toFixed(2)} KB`,
        `${sizeMB.toFixed(2)} MB`
      );
      return model[table];
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getOneData = async (id, table) => {
  try {
    if (!model[table]) {
      console.log(`One From Database`);
      const query = `SELECT * FROM ${table} WHERE ID = '${id}'`;
      const result = (await getData(query)).recordsets[0];
      return result;
    } else {
      console.log(`One From Model`);
      return model[table].filter((item) => item.ID === Number(id));
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addData = async (bodyData, table, schema) => {
  try {
    let query = `INSERT INTO ${table} VALUES ( `;
    const validation = validateAddData(bodyData, schema);
    if (validation) {
      Object.keys(bodyData).map((item) => {
        if (item !== "ID") {
          query += `'${bodyData[item]}',`;
        }
      });
      query = query.slice(0, -1);
      query += ") ";
      const result = await getData(query);
      eventEmitter.emit("addedOne", { count: 1, table: table });
      return result;
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addMany = async (data, table, schema) => {
  try {
    let query = ``;
    const validation = validateManyAdd(data, schema);
    if (validation) {
      data.map((bodyData) => {
        query += `INSERT INTO ${table} VALUES ( `;
        Object.keys(bodyData).map((item) => {
          if (item !== "ID") {
            if (bodyData[item] === "Date.Now") {
              query += `GETDATE(),`;
            } else {
              query += `'${bodyData[item]}',`;
            }
          }
        });
        query = query.slice(0, -1);
        query += ") ";
      });
      const result = await getData(query);
      eventEmitter.emit("addedMany", { data: data.length, table, table });
      return result;
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateData = async (bodyData, id, table, schema) => {
  try {
    let query = `UPDATE ${table} SET `;
    const validation = validateupdateData(bodyData, schema);
    if (validation) {
      Object.keys(bodyData).map((item) => {
        if (item !== "ID") {
          query += `"${item}" = '${bodyData[item]}',`;
        }
      });
      query = query.slice(0, -1);
      query += ` WHERE ID = '${id}'`;
      const result = await getData(query);
      eventEmitter.emit("updatedOne", {
        data: { ID: Number(id), ...bodyData },
        table: table,
      });
      return result;
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateMany = async (data, table, schema) => {
  try {
    let query = ``;
    const validation = validateManyUpdate(data, schema);
    if (validation) {
      data.map((bodyData) => {
        query += ` UPDATE ${table} SET `;
        Object.keys(bodyData).map((item) => {
          if (item !== "ID") {
            query += `${item} = '${bodyData[item]}',`;
          }
        });
        query = query.slice(0, -1);
        query += ` WHERE ID = '${bodyData.ID}' `;
      });

      const result = await getData(query);
      eventEmitter.emit("updatedMany", { data: data, table: table });
      return result;
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteData = async (id, table) => {
  try {
    let query = `DELETE FROM ${table} WHERE ID = '${id}'`;
    const result = await getData(query);
    eventEmitter.emit("deletedOne", { id: id, table: table });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMany = async (ids, table) => {
  try {
    let query = ``;
    ids.map((id) => {
      query += `DELETE FROM ${table} WHERE ID = '${id}' `;
    });
    const result = await getData(query);
    eventEmitter.emit("deletedMany", { ids: ids, table: table });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createTable,
  getAllData,
  getOneData,
  addData,
  addMany,
  updateData,
  updateMany,
  deleteData,
  deleteMany,
};
