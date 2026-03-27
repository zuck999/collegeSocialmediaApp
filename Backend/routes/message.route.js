import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";

import {
  getMessage,
  sendMessage,
  getUserKeyForExchange,
} from "../controllers/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/all/:id").get(isAuthenticated, getMessage);
router.route("/publicKey/:id").get(isAuthenticated, getUserKeyForExchange);

export default router;
