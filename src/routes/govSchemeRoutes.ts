import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";
import {
  createGovSchemeSchema,
  updateGovSchemeSchema,
} from "../validation/govSchemeValidation";
import {
  createGovScheme,
  deleteGovScheme,
  getGovSchemeById,
  listGovSchemes,
  updateGovScheme,
} from "../controller/govSchemeController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  superAdminMiddleware,
  validator.body(createGovSchemeSchema),
  createGovScheme
);

router.get("/", authMiddleware, listGovSchemes);

router.get("/:id", authMiddleware, getGovSchemeById);

router.put(
  "/:id",
  superAdminMiddleware,
  validator.body(updateGovSchemeSchema),
  updateGovScheme
);

router.delete("/:id", superAdminMiddleware, deleteGovScheme);

export default router;
