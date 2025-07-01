import express from "express";
import { uploadToS3 } from "../utils/uploadFile";

const router = express.Router();

router.get("/get-signed-url", uploadToS3);

export default router;
