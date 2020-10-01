const express = require("express");
const next = require("next");
//const port = 8080;
const port = process.env.PORT || 8080;
const { Client } = require("pg");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const db = require("./models");

// // LTI server stuff
// const lti = require("ltijs").Provider;
// const Database = require("ltijs-sequelize");

app
  .prepare()
  .then(() => {
    // EXPRESS SERVER
    const server = express();
    //connecting to database, connect function defined in /models/index.js
    (async () => {
      await db.connect();
    })();

    server.get("*", (req, res) => {
      return handle(req, res);
    });
    server.post("*", (req, res) => {
      return handle(req, res);
    });
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> App running on ${port}`);
    });

    // // LTI JS
    // //postgres://pga:Jas0n5468@peergrading.cxypn0cpzlbv.us-east-2.rds.amazonaws.com/postgres

    // // Setup ltijs-sequelize using the same arguments as Sequelize's generic contructor
    // const lti_db = new Database("postgres", "pga", "Jas0n5468", {
    //   host: "peergrading.cxypn0cpzlbv.us-east-2.rds.amazonaws.com",
    //   dialect: "postgres",
    //   logging: console.log,
    // });

    // // Setup provider
    // lti.setup(
    //   "LTIKEY", // Key used to sign cookies and tokens
    //   {
    //     plugin: lti_db, // Passing db object to plugin field
    //   },
    //   {
    //     // Options
    //     appRoute: "/",
    //     loginRoute: "/login", // Optionally, specify some of the reserved routes
    //     cookies: {
    //       secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
    //       sameSite: "", // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
    //     },
    //     devMode: false, // Set DevMode to true if the testing platform is in a different domain and https is not being used
    //   }
    // );

    // // Set lti launch callback
    // lti.onConnect((token, req, res) => {
    //   console.log(token);
    //   return res.send("It's alive!");
    // });

    // const setup = async () => {
    //   // Deploy server and open connection to the database
    //   await lti.deploy({ port: 3000 }); // Specifying port. Defaults to 3000

    //   // Register platform
    //   await lti.registerPlatform({
    //     url: "https://lti-ri.imsglobal.org/platforms/1181",
    //     name: "PGA-Test",
    //     clientId: "12345",
    //     authenticationEndpoint:
    //       "https://lti-ri.imsglobal.org/platforms/1181/authorizations/new",
    //     accesstokenEndpoint:
    //       "https://lti-ri.imsglobal.org/platforms/1181/access_tokens",
    //     authConfig: {
    //       method: "JWK_SET",
    //       key:
    //         "https://lti-ri.imsglobal.org/platforms/1181/platform_keys/1177.json",
    //     },
    //   });
    // };

    // setup();

  })
  .catch((ex) => {
    console.log("caught error");
    console.error(ex.stack);
    process.exit(1);
  });
