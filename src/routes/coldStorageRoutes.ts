import express from 'express';
import { createValidator } from 'express-joi-validation';
import { adminMiddleware, authMiddleware } from '../utils/userAuth';
import { coldStorageSchema } from '../validation/coldStorageValidation';
import { createColdStorage, getColdStorageProfile, getColdStorageList, selfOnboardColdStorage,  } from '../controller/coldStorage';

const router = express.Router();
const validator = createValidator({});

router.post(
  '/create',
  validator.body(coldStorageSchema),
  authMiddleware,
  createColdStorage
);

router.post('/self_onboard',validator.body(coldStorageSchema),selfOnboardColdStorage);

router.get("/profile/:id", authMiddleware, getColdStorageProfile);

router.get("/", adminMiddleware, getColdStorageList);

export default router;
