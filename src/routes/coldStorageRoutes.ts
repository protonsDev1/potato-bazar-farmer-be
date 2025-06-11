import express from 'express';
import { createValidator } from 'express-joi-validation';
import { authMiddleware } from '../utils/userAuth';
import { coldStorageSchema } from '../validation/coldStorageValidation';
import { createColdStorage, getColdStorageProfile } from '../controller/coldStorage';

const router = express.Router();
const validator = createValidator({});

router.post(
  '/create',
  validator.body(coldStorageSchema),
  authMiddleware,
  createColdStorage
);
router.get("/profile/:id",getColdStorageProfile);

export default router;
