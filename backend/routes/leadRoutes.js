import { createlead, getleads } from "../controllers/leadcontroller.js";
import express from "express";

const router = express.Router();

router.post("/", createlead);
router.get("/", getleads);

export default router;