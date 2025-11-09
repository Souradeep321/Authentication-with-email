import { Router } from "express";
import {
    checkAuth,
    signup,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";

const router = Router()

router.get("/check-auth", protectedRoute, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;