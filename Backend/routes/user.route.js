import express from "express";
import {
  editProfile,
  getSuggestedUsers,
  getprofile,
  login,
  logout,
  register,
  getBatchInfo,
  getUpcomingBirthdays,
  searchUser,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/:id/profile").get(isAuthenticated, getprofile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilepicture"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/directory").get(isAuthenticated, getBatchInfo);
router.route("/birthdays").get(isAuthenticated, getUpcomingBirthdays);
router.route("/search").get(isAuthenticated, searchUser);

// adfriend

export default router;
