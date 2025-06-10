import express from "express";
import { listCities, listDistricts, listStates } from "../controller/locationController";

const router = express.Router();

router.get("/states", listStates);
router.get("/cities", listCities);
router.get("/districts", listDistricts);

export default router;
