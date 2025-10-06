import express from "express";
import { createValidator } from "express-joi-validation";

import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";
import {
  createAdvertisementRequest,
  deleteAdvertisementRequest,
  getAllAdvertisementRequestByAdmin,
} from "../controller/advertisementController";
import { createAdvertisementRequestValidation } from "../validation/advertisementValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createAdvertisementRequestValidation),
  createAdvertisementRequest
);
router.get("/", superAdminMiddleware, getAllAdvertisementRequestByAdmin); // for mobile admin
router.delete("/:id", superAdminMiddleware, deleteAdvertisementRequest);

export default router;
