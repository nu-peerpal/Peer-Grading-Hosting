const dev = process.env.NODE_ENV !== "production";
exports.server = dev ? "http://localhost:8080" : "http://localhost:8080";
