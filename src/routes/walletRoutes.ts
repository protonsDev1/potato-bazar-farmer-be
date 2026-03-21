import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";

import {
  adminCreditWallet,
  adminDebitWallet,
  getUserBalance,
  getUserTransactionHistory,
  adminGetWalletDetails,
  getAdminTransactions,
} from "../controller/walletController";

import { PERMISSIONS } from "../utils/constants/permissions";
import { adminWalletSchema } from "../validation/walletValidation";

const router = express.Router();
const validator = createValidator({});

// ================= USER =================

// Get current balance
router.get("/balance", authMiddleware, getUserBalance);

// Get transaction history
router.get("/transactions", authMiddleware, getUserTransactionHistory);

// ================= ADMIN =================

// Credit wallet
router.post(
  "/admin/credit",
  checkPermissionMiddleware(PERMISSIONS.WALLET),
  validator.body(adminWalletSchema),
  adminCreditWallet,
);

// Debit wallet
router.post(
  "/admin/debit",
  checkPermissionMiddleware(PERMISSIONS.WALLET),
  validator.body(adminWalletSchema),
  adminDebitWallet,
);

// Search user wallet & transactions
// router.get(
//   "/admin/:userId",
//   checkPermissionMiddleware(PERMISSIONS.WALLET),
//   adminGetWalletDetails,
// );

router.get(
  "/admin/transactions",
  checkPermissionMiddleware(PERMISSIONS.WALLET),
  getAdminTransactions,
);

export default router;
