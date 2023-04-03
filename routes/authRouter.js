//The `authRouter.js` file will contain our authentication router, which will handle authentication-related endpoints.

// authRouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');
const { verifyAuthUser, verifyAuthAdmin} = require('../middleware/authentication');

router.get("/verify/user", verifyAuthUser, (req, res, next)=>{
    res.json(req.user)
    // res.send("loggged in")
})

router.get("/verify/admin", verifyAuthAdmin, (req,res)=>{
    res.json(req.user)
})


router.post("/getAuthUrl", authController.getAuthUrl);

//form auth
router.post("/v1/signup", validateRegister, authController.userFormSignup);
router.post("/v1/login", validateLogin, authController.userFormLogin);

//Google auth
router.post("/v2/signup", authController.userGoogleSignup);
router.post("/v2/login", authController.userGoogleLogin);

//refresh and logout 
router.post("/refreshToken", authController.refreshToken);
router.patch("/logout", authController.userLogout);

//forget password and change password
router.post("/forgotpassword", authController.forgotPassword);
router.route("/changepassword/:userId/:token").post(authController.changePassword);

module.exports = router;
