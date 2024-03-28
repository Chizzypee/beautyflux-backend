const express = require ("express");
const cors = require("cors");
const {config} = require("./config");
const { errorHandler } = require("./middlewares/error.middleware");
require("dotenv").config
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/v1/status", (req, res) => {
    res.send(`yes! welcome to ${config.APP_NAME}APP`);
})


app.use(errorHandler) // before the module.export = app
module.exports = app;