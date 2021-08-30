import * as usersRepository from "../data/users.js";

export async function create(req, res) {
  console.log("req.body: ", req.body);
  const { email, nickname, password, passwordConfirmation } = req.body;
  if(password !== passwordConfirmation) {
    res.sendStatus(403);
  }
  await usersRepository.create(email, nickname, password);
  res.redirect("/");
}
