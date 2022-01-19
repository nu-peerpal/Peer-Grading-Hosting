exports.response200 = (res, data) => {
  res.status(200).json({ status: "success", data });
  return res;
};

exports.msgResponse200 = (res, msg) => {
  res.status(200).json({ status: "success", message: msg });
  return res;
};

exports.response201 = (res, data) => {
  res.status(201).json({ status: "success", data });
  return res;
};

exports.msgResponse201 = (res, msg) => {
  res.status(201).json({ status: "success", message: msg });
  return res;
};

exports.response400 = (res, err) => {
  res.status(400).json({
    status: "fail",
    message: err.message,
  });
  return res;
};

exports.response401 = (res, msg) => {
  res.status(401).json({
    status: "fail",
    message: msg || "unauthorized access",
  });
  return res;
};

exports.response500 = (res, err) => {
  res.status(500).json({
    status: "fail",
    message: err.message,
  });
  return res;
};
