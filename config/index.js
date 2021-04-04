const dev = process.env.NODE_ENV !== "production";
exports.server = dev ? "http://localhost:8081" : "http://localhost:8081";
