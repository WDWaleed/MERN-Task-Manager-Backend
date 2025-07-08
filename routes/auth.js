const router = require("express").Router();

const {
  login,
  register,
  logout,
  sendVerificationOtp,
  verifyEmail,
} = require("../controllers/auth");
const authenticate = require("../middleware/authenticationMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.post("/send-verification-otp", authenticate, sendVerificationOtp);
router.post("/verify-email", authenticate, verifyEmail);

module.exports = router;
