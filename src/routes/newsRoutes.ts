import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";
import {
  createNewsSchema,
  updateNewsSchema,
} from "../validation/newsValidation";
import {
  createNews,
  listNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controller/newsController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  superAdminMiddleware,
  validator.body(createNewsSchema),
  createNews
);

router.get("/", authMiddleware, listNews);

router.get("/:id", authMiddleware, getNewsById);

router.put(
  "/:id",
  superAdminMiddleware,
  validator.body(updateNewsSchema),
  updateNews
);

router.delete("/:id", superAdminMiddleware, deleteNews);

export default router;
