const express = require("express");
const next = require("next");
const Keyv = require('keyv');
//const port = 8080;
const port = process.env.PORT || 8081;
const { Client } = require("pg");
const keyv = new Keyv("sqlite://auth.db");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const db = require("./models");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const lti = require("ims-lti");
const _ = require("lodash");

const jsonParser = bodyParser.json();
const consumer_key = ""
const consumer_secret = process.env.CANVAS_SECRET;
const canvas_host = process.env.CANVAS_HOST;
const AUTH_HOURS = 16;

// // LTI server stuff
// const lti = require("ltijs").Provider;
// const Database = require("ltijs-sequelize");


const translateUser = async (canvasId) => {
  // YOU ARE HERE
}


const toPeerPalCourseId = async (provider) => {
  console.log("COURSEID MAP ***");
  const params = {
    canvasCourseId: String(provider.body.custom_canvas_course_id),
    canvasAPIDomain: String(canvas_host)
  };

  const [courseMap, created] = await db.course_id_map.findOrCreate({
    where: {
      canvasCourseId: params.canvasCourseId,
      canvasAPIDomain: params.canvasAPIDomain
    },
    defaults: {
      // if the record doesn't exist and is being created,
      // you might want other defaults here as well
      canvasCourseId: params.canvasCourseId,
      canvasAPIDomain: params.canvasAPIDomain
    }
  });

  console.log("FINISHED");
  if (created) {
    console.log('created new courseidmap entry', courseMap.get({ plain: true }));
  } else {
    console.log('accessed', courseMap.get({ plain: true }));
  }

  return courseMap.peerPalCourseId;
}

const toPeerPalUserId = async (provider) => {
  const params = {
    canvasUserId: String(provider.body.custom_canvas_user_id),
    canvasAPIDomain: String(canvas_host)
  };
  const [userMap, created] = await db.user_id_map.findOrCreate({
    where: {
      canvasUserId: params.canvasUserId,
      canvasAPIDomain: params.canvasAPIDomain
    }, 
    defaults : {
      canvasUserId: params.canvasUserId,
      canvasAPIDomain: params.canvasAPIDomain
    }
  });
  if (created){
    console.log('created new useridmap entry', userMap.get({plain:true}));
  } else {
    console.log('accessed', userMap.get({plain:true}));
  }
  return userMap.peerPalUserId;
}

const response401 = (res, msg = "unauthorized access") => {
  res.status(401).json({
    status: "fail",
    message: msg,
  });

  return res;
};

function validateRequest(provider, req) {
  return new Promise((resolve, reject) => {
      provider.valid_request(req, (err, is_valid) => {
          if (err) {
              reject(err);
          } else if (is_valid) {
              resolve(true);
          } else {
              reject(new Error("Request is not valid."));
          }
      });
  });
}

async function handleLTIRequest(req, res, provider) {
  try {
      // Await the validation of the LTI request
      await validateRequest(provider, req);

      // If validation passes, proceed with fetching user and course IDs
      const peerpal_user_id = await toPeerPalUserId(provider);
      const peerpal_course_id = await toPeerPalCourseId(provider);
      const userData = {
          user_id: peerpal_user_id,
          context_id: peerpal_course_id,
          context_name: provider.context_title,
          instructor: provider.instructor,
          ta: provider.ta,
          student: provider.student,
          admin: provider.admin,
          assignment: req.body.custom_canvas_assignment_id,
          assignment_name: provider.custom_canvas_assignment_title
      };

      // Set cookies and store data in key-value store
      var nonce = Object.keys(provider.nonceStore.used)[0];
      res.cookie('authToken', nonce, AUTH_HOURS * 1000 * 60 * 60);
      res.cookie('userData', JSON.stringify(userData));
      await keyv.set(nonce, userData, AUTH_HOURS * 1000 * 60 * 60);
      req.userData = userData;

      // Proceed with the request handling
      handle(req, res);
      return userData;
  } catch (error) {
      console.error('Error processing LTI request:', error);
      res.cookie('userData', "{}");
      req.userData = null;
      res.status(500).send("Failed to process request");
  }
}




app
  .prepare()
  .then(() => {
    // EXPRESS SERVER
    const server = express();
    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json({limit: '300kb'}));
    server.use(cookieParser());
    server.enable('trust proxy');

    server.post("*", async function(req, res, next) {
      try {
        // console.log('LTI REQ:', req);
        // console.log('LTI TIME:', req.body.oauth_timestamp);
        // console.log('CURRENT TIME:',Date.now());
        // console.log('CURRENT TIME:',Date.now()/1000)
        //If the user is authenticated (and not another LTI launch), immediately handle the request
        var userData = {};
        if (req.cookies && req.cookies.authToken && !req.body.lti_message_type){
          var nonce = req.cookies.authToken;
          userData = await keyv.get(nonce);
          // console.log(userData)
          if (!_.isEmpty(userData)) {
            req.userData = userData;
            console.log("AUTHENTICATED POST.")
            return handle(req, res);
          }
        }

        // take a map from provder.body.custom_canvas_course_id
        //                 provider.body.custom_canvas_api_domain: '3.143.165.187',
 

        //Otherwise, check if the request has valid LTI credentials and authenticate the user if that's the case
        var provider = new lti.Provider(consumer_key, consumer_secret);
        userData = await handleLTIRequest(req, res, provider);
        // req.connection.encrypted = true;
        // console.log('lti provider:',provider)
        /*
        provider.valid_request(req, async (err, is_valid) => {
          if (is_valid) {
            console.log({providerBody:provider.body});
            //copying all the useful data from the provider to what will be stored for the user
            //userData.user_id = peerpal_user_id;
            //userData.context_id =  peerpal_course_id;
            const peerpal_user_id = await toPeerPalUserId(provider);
            const peerpal_course_id = await toPeerPalCourseId(provider);
            userData.user_id = peerpal_user_id;
            userData.context_id =  peerpal_course_id;
            userData.context_name = provider.context_title;
            userData.instructor = provider.instructor;
            userData.ta = provider.ta;
            userData.student = provider.student;
            userData.admin = provider.admin;
            userData.assignment = provider.body.custom_canvas_assignment_id;
            userData.assignment_name = provider.custom_canvas_assignment_title;
            //The nonce is used as the auth token to identify the user to their data
            var nonce = Object.keys(provider.nonceStore.used)[0];
            res.cookie('authToken', nonce, AUTH_HOURS * 1000 * 60 * 60);
            res.cookie('userData', JSON.stringify(userData));
            keyv.set(nonce, userData, AUTH_HOURS * 1000 * 60 * 60);
            req.userData = userData;
          } else {
            console.log('Error Occured in LTI: ', JSON.stringify(err));
            res.cookie('userData', "{}");
            req.userData = null;
          }
        });
        */
        //only add the userData if it was modified. That way, future handlers just have to check if userData exists to check authentication status
//        if (Object.keys(userData).length > 0) {
        req.userData = userData;
//        }

        if (_.isEmpty(userData)) {
          console.log("UNAUTHENTICATED POST DENIED")
          return response401(res);
        }

        return handle(req, res);
    } catch(err) {
      console.log('POST',{err});
    }
    });

    server.get("*", async (req, res) => {
      var userData = null;

      if (req.cookies && req.cookies.authToken){
        var nonce = req.cookies.authToken;
        userData = await keyv.get(nonce);
        if (!_.isEmpty(userData)) {
          console.log("AUTHENTICATED GET.")
          req.userData = userData;
        }
      }
      var data  = await req.userData;

      if (_.isEmpty(data)) {
        console.log("UNAUTHENTICATED GET DENIED")
        return response401(res);
      }

      return handle(req, res);
    });

    server.patch("*", async (req, res) => {
      if (req.cookies && req.cookies.authToken){
        var nonce = req.cookies.authToken;
        userData = await keyv.get(nonce);
        if (!_.isEmpty(userData)) {
          req.userData = userData;
          console.log("AUTHENTICATED PATCH.")
        }
      }
      var data  = await req.userData;

      if (_.isEmpty(data)) {
        console.log("UNAUTHENTICATED PATCH DENIED")
        return response401(res);
      }

      return handle(req, res);
    });

    server.delete("*", async (req, res) => {

      if (req.cookies && req.cookies.authToken){
        var nonce = req.cookies.authToken;
        const userData = await keyv.get(nonce);
        if (!_.isEmpty(userData)) {
          req.userData = userData;
          console.log("AUTHENTICATED DELETE.")
        }
      }
      var data  = await req.userData;

      if (_.isEmpty(data)) {
        console.log("UNAUTHENTICATED DELETE DENIED")
        return response401(res);
      }

      return handle(req, res);
    });

    server.put("*", async (req, res) => {

      if (req.cookies && req.cookies.authToken){
        var nonce = req.cookies.authToken;
        const userData = await keyv.get(nonce);
        if (!_.isEmpty(userData)) {
          req.userData = userData;
          console.log("AUTHENTICATED PUT.")
        }
      }
      var data  = await req.userData;

      if (_.isEmpty(data)) {
        console.log("UNAUTHENTICATED PUT DENIED")
        return response401(res);
      }

      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> App running on ${port}`);
    });

  })
  .catch((ex) => {
    console.log("caught error");
    console.error(ex.stack);
    process.exit(1);
  });
