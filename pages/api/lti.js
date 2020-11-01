const db = require("../../models/index.js");
const Op = db.Sequelize.Op;
const lti = require("ims-lti");

const consumer_key = "my_consumer_key"
const consumer_secret = "this_is_a_bad_secret123"
const provider = new lti.Provider(consumer_key, consumer_secret)

//this route will consume basic LTI v1.1 POST req
export default (req, res) => {
  return new Promise((resolve) => {
    switch (req.method) {
      case "POST":
        console.log("reached LTI route");
            // LTI 1.1
            // tool ID: 113506
            // optional: [nonce_store=MemoryStore], [signature_method=HMAC_SHA1]
            

            provider.valid_request(req, (err, is_valid) => {
            console.log(provider);

            //check if the request is valid and if the content extension is loaded.
            if (!is_valid || !provider.ext_content) return false;
            console.log(provider.outcome_service.supports_result_data('text'));
            });
            // .catch((err) => {
            //     res.status(500).send({
            //     message:
            //         err.message ||
            //         "Some error occurred while authenticating LTI.",
            //     });
            // });
        break;
      default:
        res.status(405).end(); //Method Not Allowed
        return resolve();
        break;
    }
  });
};