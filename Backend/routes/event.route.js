import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js"; // Assuming only logged-in users/admins can post
import {
  createEvent,
  getUpcomingEvents,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.route("/all").get(isAuthenticated, getUpcomingEvents);
router.route("/create").post(isAuthenticated, createEvent);
router.route("/delete/:id").delete(isAuthenticated, deleteEvent);

export default router;
