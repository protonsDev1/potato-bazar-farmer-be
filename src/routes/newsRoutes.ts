import express from "express";
import { createValidator } from "express-joi-validation";
import {
  checkPermissionMiddleware,
  optionalAuthMiddleware,
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
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.NEWS),
  validator.body(createNewsSchema),
  createNews
);

router.get("/", listNews);

router.get("/:id", optionalAuthMiddleware, getNewsById);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.NEWS),
  validator.body(updateNewsSchema),
  updateNews
);
router.post("/ai-news", validator.body(createNewsSchema), createNewsAI);

router.delete("/:id", checkPermissionMiddleware(PERMISSIONS.NEWS), deleteNews);

export default router;
