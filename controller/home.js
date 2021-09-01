import jwt from "jsonwebtoken";
const jwtSecretKey = 'lk;jasf!wejaf!@$ks%dnf^&$jweoiruaADFEWGag';

export async function home(req, res) {
  let decoded = undefined;
  if(req.cookies.token){
    const clientToken = req.cookies.token;
    decoded = jwt.verify(clientToken, jwtSecretKey);  // jwt 유효한지검사, 디코딩
    console.log('decoded: ', decoded);
  }
  res.render("home/welcome", { user: decoded });
}

export async function about(req, res) {
  res.render("home/about");
}
