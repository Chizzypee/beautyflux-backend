const express = require("express");
const { register, login, updateProfile, userAccounts, updateAccountState, logout, refreshToken, adminRegister, checkToken } = require("../controllers/account.controller");
const { userRequired, adminRequired } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/adminReg", adminRegister);

router.post("/user/update-profile", userRequired, updateProfile);
router.get("/user/account",adminRequired, userAccounts);
router.put("/user/update-state", adminRequired, updateAccountState)
router.post("/user/logout", userRequired, logout);
router.post("/user/refreshToken", refreshToken);
router.post("/user/check/", userRequired, checkToken);


module.exports = router;