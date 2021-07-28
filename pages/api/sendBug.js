const db = require("../../models");
const responseHandler = require("./utils/responseHandler");
// import email library

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  try {
    switch (req.method) {
      case "POST":
                // make sure necessary query parameters exist (if there's not a canvas ID - do not run API)
                if (!req.query.canvasId) {
                    throw new Error("Query parameter canvasId required");
                } // I can assume I have all the information, construct email 
                    // call email library, send string to the PeerPal Email.
                    await axios({
                        method: "POST",
                        url: `https://api.mailslurp.com/sendEmail?apiKey=${API_KEY}`,
                        data: {
                            senderId: inbox1.id,
                            to: inbox2.emailAddress,
                            subject: "Bug Reported",
                            body: `The following bug has occurred while a student has been using PeerPal: ${text}`,
                        }
                    })
        responseHandler.msgResponse201(
          res,
          "Successfully submitted email."
        );
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};
