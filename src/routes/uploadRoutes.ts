import express from "express";
import multer from "multer";

import { uploadDoc, uploadToS3 } from "../utils/uploadFile";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/get-signed-url", uploadToS3);
router.post("/upload-file", upload.single("file"), uploadDoc);

export default router;
