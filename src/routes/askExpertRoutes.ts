import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../utils/userAuth";
import {
  askQuery,
  getAllQueries,
  respondToQuery,
} from "../controller/askExpertController";
import {
  createQuerySchema,
  respondQuerySchema,
} from "../validation/askExpertValidation";

const router = express.Router();
const validator = createValidator({});

router.post("/", authMiddleware, validator.body(createQuerySchema), askQuery);
router.get("/", getAllQueries);
router.put("/:queryId", validator.body(respondQuerySchema), respondToQuery);

export default router;