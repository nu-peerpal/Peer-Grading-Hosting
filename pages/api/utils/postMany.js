const responseHandler = require("./responseHandler");

exports.create = async (dbTable, req, res) => { 
  if (req.method !== "POST") {
    console.log("postMany got non-POST request");
    return;
  }

  const createOrNull = async (record) => {
    try {
      return await dbTable.create(record);
    } catch (err) {
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
    result = await dbTable.create(req.body);

    responseHandler.response201(
      res,
      result.data
    );
  }
}
