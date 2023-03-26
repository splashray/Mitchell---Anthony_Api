// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

//import custom middleware
const config = require("./utils/config");
const connectDB = require("./database/dbConn");
const notFound = require("./middlewares/not-found");

//import custom router
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const newsletterRouter = require('./routers/newsletterRouter');
const applicationRouter = require('./routers/applicationRouter');

const app = express();

connectDB();

//middleware
app.use(cors());
// app.use(cookieParser())
app.use(express.json());
// app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to mitchell_anthony api");
});

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/newsletter', newsletterRouter);
app.use('/application', applicationRouter);

app.use(notFound);

mongoose.connection.once("open", () => {
  console.log("connected to DB");
  app.listen(config.PORT, () => {
    console.log(`connected to backend - ${config.PORT}`);
  });
});