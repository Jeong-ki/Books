import express from "express";
import * as homeController from "../controller/home.js";

const router = express.Router();

// home
router.get("/", homeController.home);
router.get("/about", homeController.about);

export default router;
