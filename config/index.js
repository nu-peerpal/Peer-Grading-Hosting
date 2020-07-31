const dev = process.env.NODE_ENV !== "production";
export const server = dev
  ? "http://localhost:8080"
  : "http://pganextapp-env.eba-aveqnbwr.us-east-2.elasticbeanstalk.com";
