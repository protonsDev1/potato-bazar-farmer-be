import express from "express";
import { authMiddleware } from "../utils/userAuth";
import { toggleFavourite } from "../controller/favRequestController";

const router = express.Router();

router.post("/:type/:id", authMiddleware, toggleFavourite);

export default router;
