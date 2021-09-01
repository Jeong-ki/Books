import * as postsRepository from "../data/posts.js";
import jwt from "jsonwebtoken";
const jwtSecretKey = 'lk;jasf!wejaf!@$ks%dnf^&$jweoiruaADFEWGag';

export async function index(req, res) {
  const data = await postsRepository.getAll();
  res.render("posts/index", { posts: data });
}

export async function create(req, res) {
  const author = res.locals.user.id;
  const { title, description, category } = req.body;
  await postsRepository.create(title, description, category, author);
  res.redirect("/posts");
}

export async function show(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  res.render("posts/show", { post: post });
}

export async function edit(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  res.render("posts/edit", { post: post });
}
export async function update(req, res) {
  const id = req.params.id;
  req.body.updatedAt = new Date();
  const { title, description, category, updatedAt } = req.body;
  await postsRepository.update(id, title, description, category, updatedAt);
  res.redirect("/posts/" + req.params.id);
}

export async function destory(req, res) {
  const id = req.params.id;
  await postsRepository.destory(id);
  res.redirect('/posts');
}