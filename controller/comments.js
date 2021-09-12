import * as commentsRepository from "../data/comments.js";

export async function create(req, res) {
  let post = res.locals.post;
  const username = res.locals.user.id;
  const postId = post.id;
  const text = req.body.text;
  await commentsRepository.create(username, text, postId);
  res.redirect("/posts/" + post.id + res.locals.getPostQueryString());
}

export async function update(req, res) {
  console.log(req.params.id);
  const id = req.params.id;
  let post = res.locals.post;
  const text = req.body.text;
  const updatedAt = Date.now();
  await commentsRepository.update(text, updatedAt, id);
  res.redirect("/posts/" + post.id + res.locals.getPostQueryString());
}

export async function destroy(req, res) {
  console.log(req.params.id);
  let post = res.locals.post;
  const id = req.params.id;
  await commentsRepository.destroyUpdate(id);
  res.redirect("/posts/" + post.id + res.locals.getPostQueryString());
}