import express from "express";
import { createValidator } from "express-joi-validation";
import {
  authMiddleware,
  optionalAuthMiddleware,
  superAdminMiddleware,
} from "../utils/userAuth";
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
  createNewsAI,
} from "../controller/newsController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  superAdminMiddleware,
  validator.body(createNewsSchema),
  createNews
);

router.get("/", listNews);

router.get("/:id", optionalAuthMiddleware, getNewsById);

router.put(
  "/:id",
  superAdminMiddleware,
  validator.body(updateNewsSchema),
  updateNews
);
router.post(
  "/api-news",
  validator.body(createNewsSchema),
  createNewsAI
);

router.delete("/:id", superAdminMiddleware, deleteNews);

export default router;
