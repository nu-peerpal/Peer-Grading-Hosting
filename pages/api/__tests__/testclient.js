import http from "http";
import request from "supertest";
import { apiResolver } from "next-server/dist/server/api-utils";

export const createTestClient = (handler) => {
  const requestHandler = (req, res) =>
    apiResolver(req, res, undefined, handler);
  const server = http.createServer(requestHandler);
  return request(server);
};
