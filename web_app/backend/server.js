const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = require("../database/connection.json");
const http = require("http");
const querystring = require("querystring");
const { response } = require('express');
const cors = require("cors");

const con = mysql.createConnection({
	host: connection.host,
	user: connection.user,
	password: connection.pass,
	database: connection.database
  });

var apiRouter = require("./routes/api.js");
var indexRouter = require("./routes/index.js")

const app = express();
const PORT = 8080;
app.set('port', PORT);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/../static')));

app.use("/api", apiRouter);
app.use("/index", indexRouter);

//module.exports = app;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));