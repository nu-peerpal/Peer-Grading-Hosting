const express = require("express");
const next = require("next");
//const port = 8080;
const port = process.env.PORT || 8080;
const { Client } = require("pg");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


app
  .prepare()
  .then(() => {
    const server = express();
    const db = require("./server/models");
    db.sequelize.sync();
    // //without sequelize
    // const client = new Client({
    //   connectionString:
    //     "postgres://pga:Jas0n5468@peergrading.cxypn0cpzlbv.us-east-2.rds.amazonaws.com/postgres",
    // });
    // // const client = new Client({
    // //   connectionString: process.env.RDS_CONNECTION_STRING,
    // // });
    // client.connect(function (err) {
    //   console.log("RUNNIN'");
    //   if (!err) {
    //     console.log("Database is connected ... ");
    //   } else {
    //     console.log(err);
    //   }
    // });
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    // require("./server/routes/enrollment.routes")(server);

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> App running on ${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
