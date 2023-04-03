const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const config = require("../utils/config");
const { generateTokens, verifyRefreshToken } = require("../middleware/authentication");


const {
  handleAsync,
  createApiError,
  handleResponse
} = require("../utils/helpers");

const {
  SCOPES,
  generateClient,
  userExist,
  getAccessToken,
  verify,
  googleSignup
} = require("../utils/authFunctions");
// const { sendChangePasswordEmail } = require("../utils/email");

let client;

//get google auth Url
const getAuthUrl = (req, res, next) => {
  try {
    const { authType } = req.body;
    client = generateClient(authType);
    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    res.status(200).json({
      urlAuth: authUrl
    });
  } catch (error) {
    throw createApiError(
      "could not connect to google servers, please try again later",
      503
    );
  }
};

const userGoogleSignup = handleAsync(async (req, res, next) => {

    let { code} = req.body;

    if (!code) throw createApiError("Code field is missing", 400);

          const createdUser = await googleSignup(code, client);

          //RefreshToken saved into User model within the generateTokens function 
          const { accessToken, refreshToken } = await generateTokens(createdUser);

          return res.status(200).json(
            handleResponse(
              {
                userId: createdUser._id.toString(),
                username: createdUser.username,
                email: createdUser.email, 

                token: accessToken,
                refreshToken: refreshToken  
              },
              "Account Created and user logged in successfully"
            )
          );


});

const userFormSignup = handleAsync(async (req, res, next) => {
    let { username, email, password} = req.body;
  
  
        //Form signup
        const errors = validationResult(req);
  
        if (!errors.isEmpty())
          throw createApiError("user validation failed", 422, errors.array);
  
        if (!username || !email || !password) throw createApiError("One of fields is missing", 400);
  
        //create new user
        if (await userExist(email)) throw createApiError("email already in use", 401);
  
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({
          username: username,
          email: email,
          authenticationType: {
            form: {
              password: hash
            }
          },
        });
  
        const createdUser = await newUser.save();
  
          // RefreshToken saved into User model within the generateTokens function 
          const { accessToken, refreshToken } = await generateTokens(createdUser);
  
        res.status(201).json(
          handleResponse(
            {
           
              userId: createdUser._id.toString(),
              username: createdUser.username,
              email: createdUser.email,  
  
              token: accessToken,
              refreshToken: refreshToken, 
            },
            "Account Created and user logged in successfully"
          )
        );
   
});

const userGoogleLogin = handleAsync(async (req, res, next) => {
  var { code } = req.body;
  let user;

    const tokenId = await getAccessToken(code, client);
    const payload = await verify(tokenId, client);
    email = payload["email"];

    user = await User.findOne({ email: email });
    if (!user){
          user = await googleSignup(code, client, payload);
    }
    
  const { accessToken, refreshToken } = await generateTokens(user);

  return res.status(201).json(
    handleResponse(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,  

        token: accessToken, 
        refreshToken: refreshToken,
      },
      "user logged in successfully"
    )
  );
});

const userFormLogin = handleAsync(async (req, res, next) => {
  var { email, password } = req.body;
  let user;

    user = await User.findOne({ email: email });
    if (!user)
      throw createApiError("A user for this email could not be found!", 401);

    const isEqual = await bcrypt.compare(
      password,
      user.authenticationType.form.password
    );

    if (!isEqual) throw createApiError("Wrong password!", 401);

  const { accessToken, refreshToken } = await generateTokens(user);

  return res.status(201).json(
    handleResponse(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,  

        token: accessToken, 
        refreshToken: refreshToken,
      },
      "user logged in successfully"
    )
  );

});

const refreshToken = handleAsync(async (req, res) => {
  const { tokenDetails } = await verifyRefreshToken(req.body.refreshToken);

  const payload = { userId: tokenDetails.userId };

  const accessToken = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "1d"
  });

  res
    .status(200)
    .json(handleResponse({ accessToken }, "Access token created successfully"));
});

const userLogout = handleAsync(async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const userToken = await User.findOne({ refreshToken });

  if (!userToken)
    return res.status(200).json(handleResponse({}, "User is not Loggedin"));

  userToken.refreshToken = "";
  await userToken.save();
  res.status(200).json(handleResponse({}, "Logged Out Sucessfully"));
});

const forgotPassword = handleAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw createApiError("User does not exist", 400);

  const token = crypto.randomBytes(10).toString("hex");

  const link = `${config.BASE_URL}/changepassword/${user._id}/${token}`;

  await sendChangePasswordEmail({ email, link });

  res
    .status(200)
    .json(handleResponse({}, "password reset link sent to your email account"));
});

const changePassword = handleAsync(async (req, res) => {
  const { userId, token } = req.params;

  if (!token) throw createApiError("token is required", 400);

  const { newpassword, confirmpassword } = req.body;

  if (!newpassword || !confirmpassword)
    throw createApiError("newpassword and confirmpassword are required", 400);

  if (newpassword != confirmpassword)
    throw createApiError("both passwords are not the same", 400);

  const user = await User.findById(userId);

  user.authenticationType.form.password = await bcrypt.hash(newpassword, 10);

  await user.save();

  res.status(200).json(handleResponse({}, "password changed"));
});

module.exports = {
  userGoogleSignup,
  userFormSignup,
  userGoogleLogin,
  userFormLogin,
  refreshToken,
  userLogout,
  forgotPassword,
  changePassword,
  getAuthUrl
};