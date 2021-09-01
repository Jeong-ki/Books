import express from "express";
import * as homeController from "../controller/home.js";

const router = express.Router();

// home
router.get("/", homeController.home);
router.get("/about", homeController.about);
router.get("/logout", function(req, res) {
  res.clearCookie('token').redirect("/");
})

export default router;
