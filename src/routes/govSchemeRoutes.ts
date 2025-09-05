import express from "express";
import { createValidator } from "express-joi-validation";
import { checkPermissionMiddleware } from "../utils/userAuth";
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
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.GOVT_SCHEMES),
  validator.body(createGovSchemeSchema),
  createGovScheme
);

router.get("/", listGovSchemes);

router.get("/:id", getGovSchemeById);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.GOVT_SCHEMES),
  validator.body(updateGovSchemeSchema),
  updateGovScheme
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.GOVT_SCHEMES),
  deleteGovScheme
);

export default router;
