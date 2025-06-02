import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Obtiene lista de usuarios excluyendo al usuario actual
router.get("/users", protectRoute, getUsersForSidebar);

// Obtiene mensajes entre usuario actual y usuario con :id
router.get("/:id", protectRoute, getMessages);

// Envía un mensaje al usuario con :id
router.post("/send/:id", protectRoute, sendMessage);

export default router;
