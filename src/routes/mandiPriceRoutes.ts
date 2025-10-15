import express from "express";
import { createValidator } from "express-joi-validation";
import {
  createMandiPriceSchema,
  updateMandiPriceSchema,
} from "../validation/mandiPriceValidation";
import {
  createMandiPrice,
  deleteMandiPrice,
  getCitiesWithMandisController,
  getDashboardStats,
  getTopMandiPrices,
  retrieveAllMandiPrices,
  retrieveAllMandiPricesForMobileUsers,
  retrieveAllMandisAllotedToAgent,
  retrieveMandiPriceById,
  updateMandiPrice,
} from "../controller/mandiPriceController";
import { mandiAgentAndSuperAdminMiddleware } from "../utils/userAuth";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  mandiAgentAndSuperAdminMiddleware,
  validator.body(createMandiPriceSchema),
  createMandiPrice
);
router.get("/", mandiAgentAndSuperAdminMiddleware, retrieveAllMandiPrices); // for mobile admin

router.get("/mobile/:mandiId", retrieveAllMandiPricesForMobileUsers); //   for mobile app

router.get(
  "/profile/:mandiPriceId",
  mandiAgentAndSuperAdminMiddleware,
  retrieveMandiPriceById
);
router.put(
  "/:mandiPriceId",
  mandiAgentAndSuperAdminMiddleware,
  validator.body(updateMandiPriceSchema),
  updateMandiPrice
);
router.delete(
  "/:mandiPriceId",
  mandiAgentAndSuperAdminMiddleware,
  deleteMandiPrice
);
router.get("/dash_stats", mandiAgentAndSuperAdminMiddleware, getDashboardStats);
router.get(
  "/alloted_mandi",
  mandiAgentAndSuperAdminMiddleware,
  retrieveAllMandisAllotedToAgent
);
router.get("/city-list", getCitiesWithMandisController);

router.get("/top", getTopMandiPrices);

export default router;
