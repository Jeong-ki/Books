import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as usersRepository from "../data/users.js";
import * as postsRepository from "../data/posts.js";
import { config } from "../config.js";



// configuration
const jwtSecretKey = config.jwt.SecretKey;
const jwtExpiresInDays = config.jwt.expiresSec;
const bcryptSaltRounds = config.jwt.bcryptSoltRound;

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
  await usersRepository.create({email, nickname, password:hashed});
  const token = createJwtToken(nickname);
  console.log("signUp token: ", token);
  res.cookie('token', token);
  res.redirect("/");
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await usersRepository.findByEmail(email);
  if(!user) {
    return res.render("users/login", { message: '* Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  console.log(password, user.password);
  if(!isValidPassword) {
    return res.render("users/login", { message: '* Invalid user or password' });
  }
  const token = createJwtToken(user.nickname);
  // console.log("login token: ", token);
  // console.log("login user:", user);
  res.cookie('token', token);
  res.redirect("/");
}

export async function show(req, res){
  console.log(req.params);
  if(req.params.nickname){
    const nickname = req.params.nickname;
    const me = await usersRepository.findByNickname(nickname);
    const data = await postsRepository.getByAuthor(nickname);
    res.render("users/show", { me: me, posts: data });
  } else {
    res.redirect("/"); // ??
  }
}

export async function edit(req, res) {
  const nickname = req.params.nickname;
  const me = await usersRepository.findByNickname(nickname);
  res.render("users/edit", { me: me });
}

export async function update(req, res) {
  const currentNickname = req.params.nickname;
  const { currentPassword, email, nickname, newPassword, passwordConfirmation } = req.body;
  console.log(req.body);
  const now = await usersRepository.findByNickname(currentNickname);
  const found = await usersRepository.findByEmail(email);
  if(found) {
    return res.status(409).json({ message: `${email} already exists` });
  }
  if(newPassword !== passwordConfirmation) {
    return res.status(403).json({ message: 'wrong confirmation' });
  }
  const isValidPassword = await bcrypt.compare(currentPassword, now.password);
  if(!isValidPassword) {
    return res.status(403).json({ message: 'wrong current password' });
  }
  const hashed = await bcrypt.hash(newPassword, bcryptSaltRounds);
  console.log("currentNickname: ", currentNickname, "nickname: ", nickname);
  await postsRepository.updateAuthor(nickname, currentNickname);
  await usersRepository.update({currentNickname, email, nickname, password:hashed});
  res.clearCookie('token');
  const token = createJwtToken(nickname);
  console.log("update token: ", token);
  res.cookie('token', token);
  res.redirect('/users/' + nickname);
}

export async function destory(req, res) {
  const nickname = req.params.nickname;
  await usersRepository.destory(nickname);
  res.clearCookie('token').redirect("/");
}

function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}