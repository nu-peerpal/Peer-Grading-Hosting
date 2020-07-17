const express = require("express");
const next = require("next");
//const port = 8080;
const port = process.env.PORT || 8080;
const { Client } = require("pg");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

//var sequelize = new Sequelize(process.env.RDS_CONNECTION_URL || [localhost]);

app
  .prepare()
  .then(() => {
    const server = express();
    // const client = new Client({
    //   user: "pga",
    //   host: "peergrading.cxypn0cpzlbv.us-east-2.rds.amazonaws.com",
    //   password: "Jas0n5468",
    //   port: 5432,
    // });

    const client = new Client({
      connectionString: process.env.RDS_CONNECTION_STRING,
    });

    // const client = new Client({
    //   host: process.env.RDS_HOSTNAME,
    //   user: process.env.RDS_USERNAME,
    //   database: process.env.RDS_DB_NAME,
    //   password: process.env.RDS_PASSWORD,
    //   port: process.env.RDS_PORT,
    // });

    client.connect(function (err) {
      console.log("RUNNIN'");
      if (!err) {
        console.log("Database is connected ... ");
      } else {
        console.log(err);
      }
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> App running on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
