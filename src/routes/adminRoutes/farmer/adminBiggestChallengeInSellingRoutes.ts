import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { biggestChallengeInSellingSchema } from "../../../validation/adminValidation";
import {
  addBiggestChallengeInSelling,
  deleteBiggestChallengeInSelling,
  getBiggestChallengeInSelling,
  updateBiggestChallengeInSelling,
} from "../../../controller/adminController/farmer/biggestChallengeInSelling";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(biggestChallengeInSellingSchema),
  addBiggestChallengeInSelling
);

router.get("/", getBiggestChallengeInSelling);

router.put("/:id", authMiddleware, updateBiggestChallengeInSelling);

router.delete("/:id", authMiddleware, deleteBiggestChallengeInSelling);

export default router;
