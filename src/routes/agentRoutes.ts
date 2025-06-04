import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../utils/userAuth";
import {
  getAllRegisteredUsers,
  getRecentRegisteredUsers,
} from "../controller/agent";

const router = express.Router();
const validator = createValidator({});

router.get("/all_registration", authMiddleware, getAllRegisteredUsers);
router.get("/recent_registration", authMiddleware, getRecentRegisteredUsers);

export default router;
