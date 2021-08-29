import express from "express";
import homeRouter from "./router/home.js";
import postRouter from "./router/posts.js";
import path from "path";
const __dirname = path.resolve();
import methodOverride from "method-override";
// var methodOverride = require('method-override');

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

app.use("/", homeRouter);
app.use("/posts", postRouter);

app.listen(3000);
