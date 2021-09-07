const axios = require("axios")

export const config = {
  api: {
    bodyParser: false,
  },
}

const canvas = process.env.CANVAS_HOST;
const token = process.env.CANVAS_TOKEN;
const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;
const responseHandler = require("./utils/responseHandler");

export default async (req, res) => {
    try {
      switch (req.method) {
        case "POST":

            //   if (!req.body) {
            //     throw new Error("Message required");
            // }
            let recipient, subject, message;

            if (req.query.type == 'bug') {
                recipient = 'peerpal.io@gmail.com'
                subject = `Bug/Issues from ${req.body.userId}`
                message = `I have encountered the following bugs/issues: ${req.body.message}.`
                
            } else {
                const response = await axios.get(canvas + "courses/" + req.query.courseId + "/users?per_page=300", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }})


                let foundUser = response.data.filter(user => user.id == req.body.userId)

                recipient = foundUser[0].email
                subject = req.body.subject
                message = req.body.message
                    

            }

            const sendBug = require('gmail-send')({
                user: gmailUser,
                pass: gmailPass,
                to:   recipient,
                subject: subject,
              });

              sendBug({
                text:    message,  
                }, (error, result, fullResult) => {
                if (error) console.error(error);
                console.log(result);
                })


            responseHandler.msgResponse201(
                res,
                "Successfully sent email.",
              );
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
    } catch (err) {
      responseHandler.response400(res, err);
    }
  };