const router = require("express").Router();

const { login, register, logout } = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports = router;
