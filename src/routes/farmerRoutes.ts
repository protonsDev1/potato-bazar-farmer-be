import { createValidator } from "express-joi-validation";
import express from "express";
import { adminMiddleware, authMiddleware, checkOtpVerified } from "../utils/userAuth";
import { farmerSchema } from "../validation/farmerValidation";
import { createFarmer } from "../controller/farmer";

const router = express.Router();
const validator = createValidator({});  


router.post('/create', validator.body(farmerSchema),authMiddleware, checkOtpVerified, createFarmer);


export default router;
