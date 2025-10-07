import express from "express";
import { createValidator } from "express-joi-validation";

import { checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createFaq,
  deleteFaq,
  getAllFaqs,
  updateFaq,
} from "../controller/faqController";
import { createFaqValidation } from "../validation/faqValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.FAQ),
  validator.body(createFaqValidation),
  createFaq
);
router.get("/", getAllFaqs);
router.put("/:id", checkPermissionMiddleware(PERMISSIONS.FAQ), updateFaq);
router.delete("/:id", checkPermissionMiddleware(PERMISSIONS.FAQ), deleteFaq);

export default router;
