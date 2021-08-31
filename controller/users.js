import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as usersRepository from "../data/users.js";
//import cookieParser from "cookie-parser";

// configuration
const jwtSecretKey = 'lk;jasf!wejaf!@$ks%dnf^&$jweoiruaADFEWGag';
const jwtExpiresInDays = '2d';
const bcryptSaltRounds = 12;

export async function signup(req, res) {
  console.log("req.body: ", req.body);
  const { email, nickname, password, passwordConfirmation } = req.body;
  const found = await usersRepository.findByEmail(email);
  if(found) {
    return res.status(409).json({ message: `${email} already exists` });
  }
  if(password !== passwordConfirmation) {
    res.sendStatus(403);
  }
  const hashed = await bcrypt.hash(password, bcryptSaltRounds);
  const userId = await usersRepository.create({email, nickname, password:hashed});
  const token = createJwtToken(userId);
  console.log("signUp token: ", token);
  res.redirect("/", { token: token });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await usersRepository.findByEmail(email);
  if(!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if(!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = createJwtToken(user.email);
  console.log("login token: ", token);
  console.log("login user:", user);
  res.cookie('token', token);
  res.redirect("/");
}

function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}

export async function show(req, res){
  console.log(req.body);
  res.render("users/show", { user: user });
}
