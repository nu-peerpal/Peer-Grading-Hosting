const includeExcludeProps = (req, dbResult) => {
  if (req.query.include) {
    for (const property of dbResult) {
      if (property === "id") continue;
      if (
        (typeof req.query.include === "string" &&
          property !== req.query.include) ||
        (Array.isArray(req.query.include) && !(property in req.query.include))
      ) {
        delete dbResult[property];
      }
    }
  }

  if (req.query.exclude) {
    for (const property of dbResult) {
      if (
        (typeof req.query.include === "string" &&
          property === req.query.exclude) ||
        (Array.isArray(req.query.exclude) && property in req.query.include)
      ) {
        delete dbResult[property];
      }
    }
  }

  return dbResult;
};

module.exports = includeExcludeProps;
