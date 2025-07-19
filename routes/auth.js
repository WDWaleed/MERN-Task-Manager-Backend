const router = require("express").Router();

const {
  login,
  register,
  logout,
  sendVerificationOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} = require("../controllers/auth");
const authenticate = require("../middleware/authenticationMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

// Protected routes
router.post("/send-verification-otp", authenticate, sendVerificationOtp);
router.post("/verify-email", authenticate, verifyEmail);
router.get("/is-authenticated", authenticate, isAuthenticated);

module.exports = router;
