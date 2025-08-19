import express from 'express';
import { createValidator } from "express-joi-validation";
import { createKycSchema, updateKycStatusSchema } from '../validation/kycValidation';
import { createKyc, approveOrRejectKyc, listKyc, getKycDetail } from '../controller/kycController';
import { authMiddleware } from '../utils/userAuth';

const router = express.Router();
const validator = createValidator({});  

router.post('/',authMiddleware, validator.body(createKycSchema), createKyc);
router.patch('/:id', validator.body(updateKycStatusSchema), approveOrRejectKyc);
router.get('/', listKyc);
router.get('/:id', getKycDetail);

export default router;
