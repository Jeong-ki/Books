import express from "express";
import homeRouter from "./router/home.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.json());

app.use("/", homeRouter);

app.listen(3000);
