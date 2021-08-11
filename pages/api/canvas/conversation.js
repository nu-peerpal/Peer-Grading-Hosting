const axios = require("axios")
const { server } = require("../../../config/index.js");

const canvas = process.env.CANVAS_HOST;
const token = process.env.CANVAS_TOKEN;
const responseHandler = require("../utils/responseHandler");

export default async (req, res) => {
    try {
      switch (req.method) {
        case "POST":
          if (!userId && !message) {
            throw new Error("Query parameter userId and message required");
          }
          let userId = req.query.userId
          let message = req.query.message
          console.log('data:',data)
          const response = await axios.post(canvas + `conversations?recipients=${userId}&body=${message}&group_conversations=true&subject=TAReviews`, {
            headers: {
              'Authorization': `Bearer ${token}`
          }
          });
          responseHandler.response201(
              response,
              "Successfully created conversation.",
          );
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
    } catch (err) {
      responseHandler.response400(res, err);
    }
  };