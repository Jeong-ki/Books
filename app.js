import express from "express";
import homeRouter from "./router/home.js";
import postRouter from "./router/posts.js";
import userRouter from "./router/users.js";
import path from "path";
const __dirname = path.resolve();
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const jwtSecretKey = 'lk;jasf!wejaf!@$ks%dnf^&$jweoiruaADFEWGag';

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use(function(req,res,next){
  console.log(req.cookies);
  if(req.cookies.token){
    const clientToken = req.cookies.token;
    let decoded = jwt.verify(clientToken, jwtSecretKey);  // jwt 유효한지검사, 디코딩
    res.locals.islogined = true;
    res.locals.user = decoded;
  }
  next();
});

app.use("/", homeRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);

app.listen(3000);
