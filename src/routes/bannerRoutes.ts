import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
  getPublicBanners,
} from "../controller/bannerController";
import {
  createBannerSchema,
  updateBannerSchema,
} from "../validation/bannerValidation";

const router = express.Router();
const validator = createValidator({});

router.get("/public", getPublicBanners);

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.PROMOTIONAL_BANNERS),
  validator.body(createBannerSchema),
  createBanner
);

router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.PROMOTIONAL_BANNERS),
  getAllBanners
);

router.get(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.PROMOTIONAL_BANNERS),
  getBannerById
);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.PROMOTIONAL_BANNERS),
  validator.body(updateBannerSchema),
  updateBanner
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.PROMOTIONAL_BANNERS),
  deleteBanner
);

export default router;
