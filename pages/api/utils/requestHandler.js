const responseHandler = require("./responseHandler");
const db = require("../../../models/index.js");




// config = {
//   table: "the table, e.g., "courses" for db.courses (required)",
//   getRequired: "list of required parameters (optional)"
//   getRequiredCount: "number of required parameters (default: required.length)"
//   getOptional: "list of optional parameters (optional)".
// }

exports.idRequest = async (req,res,config) => {
  const table = db[config.table];

  try {
    let row = await table.findByPk(req.query.id);

    switch (req.method) {
      case "GET":
        responseHandler.response200(res, row);
        break;

      case "DELETE":
        await row.destroy();
        responseHandler.msgResponse200(res, "Successfully removed database entry.");
        break;

      case "PATCH":
        for (const property in req.body) {
          row[property] = req.body[property];
        }
        const response = await row.save();
        responseHandler.response201(
          res,
          response.dataValues
        );
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    console.log('idRequest',{err})
    responseHandler.response400(res, err);
  }
};

exports.request = async (req,res,config) => {
  try {
    switch (req.method) {
      case "GET":
        await exports.get(req,res,config);
        break;
      case "POST":
        await exports.post(req,res,config);
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    console.log('ERROR [requestHandler.request]',err);
    responseHandler.response400(res, err);
  }
};

exports.get = async (req,res,config) => {

  const table = db[config.table];

  const requiredCount = (config.getRequiredCount)
    ? config.getRequiredCount
    : (config.getRequired || []).length;

  if (config.getRequired && config.getRequired.filter(q => req.query[q]).length < requiredCount) {
    throw new Error(`At least ${config.getRequiredCount} Query parameter in [${config.getRequired}] required`);
  }

  const passThrough = [
    ...config.getRequired || [],
    ...config.getOptional || []
  ];

  const passedThrough = passThrough
    .filter(q => typeof req.query[q] !== "undefined");

  const params = Object.fromEntries(passedThrough
    .map(q => [q,req.query[q]])
  );

  let result = (passedThrough.length)
    ? await table.findAll({where: params})
    : await table.findAll();

  responseHandler.response200(res, result);
};


exports.post = async (req, res, config) => {
  const table = db[config.table];

  const createOrNull = async (record) => {
    try {
      return await table.create(record);
    } catch (err) {
      console.log('error post multiple', err);
      return null;
    }
  };

  if (req.query.type === "multiple") {
    let result = (await Promise.all(req.body.map(record => createOrNull(record))))
      .map(r => ((r || {}).data || null));

    // remove responses for users already in the db
    let filteredResult = result.filter(r => r);

    if (req.query.filter)
      result = filteredResult;

    if (filteredResult.length) {
      responseHandler.response201(
        res,
        result
      );
    } else {
      responseHandler.response200(
        res,
        result
      );
    }

  } else {
    let result = await table.create(req.body);

    responseHandler.response201(
      res,
      result.data
    );
  }
};
