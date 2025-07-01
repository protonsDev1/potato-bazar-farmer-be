import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
import {
  addSellingPlace,
  deleteSellingPlace,
  getActiveSellingPlaces,
  getSellingPlaces,
  updateSellingPlace,
} from "../../../controller/adminController/farmer/sellingPlaceController";
import { createValidator } from "express-joi-validation";
import {
  sellingPlaceCreateSchema,
  sellingPlaceUpdateSchema,
} from "../../../validation/adminValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(sellingPlaceCreateSchema),
  addSellingPlace
);
router.get("/", authMiddleware, getSellingPlaces);
router.get("/active", authMiddleware, getActiveSellingPlaces);
router.put(
  "/:id",
  authMiddleware,
  validator.body(sellingPlaceUpdateSchema),
  updateSellingPlace
);
router.delete("/:id", authMiddleware, deleteSellingPlace);

export default router;
