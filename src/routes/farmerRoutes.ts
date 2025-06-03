import { createValidator } from "express-joi-validation";
import express from "express";
import { adminMiddleware, authMiddleware, checkOtpVerified } from "../utils/userAuth";
import { onboardFarmerSchema } from "../validation/farmerValidation";
import { createFarmer, getProfileOverview, getFarmerList } from "../controller/farmer";

const router = express.Router();
const validator = createValidator({});  


router.post('/create',authMiddleware, validator.body(onboardFarmerSchema),createFarmer);
router.get("/profile/:farmerId",authMiddleware,getProfileOverview);
router.get('/get-farmer-list',adminMiddleware,getFarmerList);

export default router;
