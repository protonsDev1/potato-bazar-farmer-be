import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
import {
  addSellingChannel,
  deleteSellingChannel,
  getActiveSellingChannels,
  getSellingChannels,
  updateSellingChannel,
} from "../../../controller/adminController/farmer/sellingChannelController";
import { createValidator } from "express-joi-validation";
import {
  sellingChannelCreateSchema,
  sellingChannelUpdateSchema,
} from "../../../validation/adminValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(sellingChannelCreateSchema),
  addSellingChannel
);
router.get("/", authMiddleware, getSellingChannels);
router.get("/active", authMiddleware, getActiveSellingChannels);
router.put(
  "/:id",
  authMiddleware,
  validator.body(sellingChannelUpdateSchema),
  updateSellingChannel
);
router.delete("/:id", authMiddleware, deleteSellingChannel);

export default router;
