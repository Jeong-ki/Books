import jwt from "jsonwebtoken";
const jwtSecretKey = 'lk;jasf!wejaf!@$ks%dnf^&$jweoiruaADFEWGag';

export async function home(req, res) {
  const clientToken = req.cookies.token;
  const decoded = jwt.verify(clientToken, jwtSecretKey);
  console.log('decoded: ', decoded);
  res.render("home/welcome", { user: decoded });
}

export async function about(req, res) {
  res.render("home/about");
}
