const router = require("express").Router();
const authenticate = require("../middleware/authenticationMiddleware");
const { getUserData } = require("../controllers/user");

router.get("/data", authenticate, getUserData);

module.exports = router;
