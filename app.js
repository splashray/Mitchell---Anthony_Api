// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

//import custom middleware
const config = require("./utils/config");
const connectDB = require("./database/dbConn");
const notFound = require("./middleware/not-found");

//import custom router
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const newsletterRouter = require('./routes/newsletterRouter');
const applicationRouter = require('./routes/applicationRouter');

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

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/application', applicationRouter);

app.use(notFound);

mongoose.connection.once("open", () => {
  console.log("connected to DB");
  app.listen(config.PORT, () => {
    console.log(`connected to backend - ${config.PORT}`);
  });
});