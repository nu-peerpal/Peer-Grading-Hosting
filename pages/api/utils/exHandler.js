exports.response500 = (res, err) => {
  res.status(500).json({
    status: "fail",
    message: err.message,
  });
  return res;
};

exports.response400 = (res, err) => {
  res.status(400).json({
    status: "fail",
    message: err.message,
  });
  return res;
};
