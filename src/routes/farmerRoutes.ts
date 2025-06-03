import { createValidator } from "express-joi-validation";
import express from "express";
import { adminMiddleware, authMiddleware, checkOtpVerified } from "../utils/userAuth";
import { onboardFarmerSchema } from "../validation/farmerValidation";
import { createFarmer, getAllFarmers, getFarmersUnderAgent,  } from "../controller/farmer";

const router = express.Router();
const validator = createValidator({});  


router.post('/create',authMiddleware, validator.body(onboardFarmerSchema),createFarmer);
router.get("/",getAllFarmers);
router.get("/under_agent",authMiddleware,getFarmersUnderAgent);

export default router;
