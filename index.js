'use strict';

// importing required libraries
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const dotenv = require('dotenv').config();
const errorController = require("./controllers/errorController");
const cors = require('cors');
const { port, mongoURI } = require("./utils/constants");
// const { storeJsonToDb, storeKeyValueToDb } = require("./utils/utils");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());
app.use(routes);
app.use(errorController.get404);

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
        server.listen(port, function () {
            console.log(" Server Successfully Started ", port);
            // storeJsonToDb();
            // storeKeyValueToDb();
        });
    });