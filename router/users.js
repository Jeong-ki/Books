import express from "express";
import * as usersController from "../controller/users.js";

const router = express.Router();

// users
// sign up
router.get("/signUp", function(req, res){
  res.render('users/signUp');
});
router.post("/", usersController.signup);

// login
router.get("/login", function(req, res) {
  res.render('users/login');
});
router.post("/login", usersController.login);

// show
router.get("/:nickname", usersController.show);

export default router;