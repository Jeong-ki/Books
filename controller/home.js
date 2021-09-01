import jwt from "jsonwebtoken";
const jwtSecretKey = 'lk;jasf!wejaf!@$ks%dnf^&$jweoiruaADFEWGag';

export async function home(req, res) {
  res.render("home/welcome");
}

export async function about(req, res) {
  res.render("home/about");
}