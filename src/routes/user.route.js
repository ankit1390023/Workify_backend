import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    registerUser,
    loginUser,
    logOut,
    refreshToken,
    changePassword,
    getCurrentUser,
    updateAvatar,
    updateUserCoverImage,
    updateAccountDetails,
    AI,
    forgotPassword,
    resetPassword,
    validateResetToken,
    deleteUserCoverImage
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

// Test email configuration
router.get("/test-email", async (req, res) => {
    try {
        await sendEmail({
            email: process.env.SMTP_USER, // Send to yourself
            subject: "Test Email",
            message: "This is a test email to verify your email configuration."
        });
        res.json({ message: "Test email sent successfully" });
    } catch (error) {
        console.error("Test email error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Auth routes
router.post("/register", upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), registerUser);

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logOut);
router.post("/refresh-token", refreshToken);

// Password management routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/validate-reset-token", validateResetToken);
router.post("/change-password", verifyJWT, changePassword);

// User profile routes
router.get("/current-user", verifyJWT, getCurrentUser);
router.patch("/update-avatar", verifyJWT, upload.single("avatar"), updateAvatar);
router.patch("/update-cover-image", verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.delete("/delete-cover-image", verifyJWT, deleteUserCoverImage);
router.patch("/update-account", verifyJWT, upload.single("resume"), updateAccountDetails);

// AI route
router.post("/ai", verifyJWT, AI);

export default router;
