import express from "express";
import * as usersController from "../controller/users.js";

const router = express.Router();

// users
// sign up
router.get("/signUp", function(req, res){
  res.render('users/signUp');
});
router.post("/", usersController.create);

// login
router.get("/login", function(req, res) {
  res.render('users/login');
})

export default router;