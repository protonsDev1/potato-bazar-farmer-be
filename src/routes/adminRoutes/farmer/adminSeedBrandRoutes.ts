import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
import {
  addSeedBrand,
  deleteSeedBrand,
  getActiveSeedBrands,
  getSeedBrands,
  updateSeedBrand,
} from "../../../controller/adminController/farmer/seedBrandController";
import {
  seedBrandCreateSchema,
  seedBrandUpdateSchema,
} from "../../../validation/adminValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(seedBrandCreateSchema),
  addSeedBrand
);
router.get("/", authMiddleware, getSeedBrands);
router.get("/active", authMiddleware, getActiveSeedBrands);
router.put(
  "/:id",
  authMiddleware,
  validator.body(seedBrandUpdateSchema),
  updateSeedBrand
);
router.delete("/:id", authMiddleware, deleteSeedBrand);

export default router;
