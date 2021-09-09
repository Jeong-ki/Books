import * as commentsRepository from "../data/comments.js";

export async function create(req, res) {
  let post = res.locals.post;
  const username = res.locals.user.id;
  const postId = post.id;
  const text = req.body.text;
  const parentComment = null;  // 임시
  await commentsRepository.create(username, parentComment, text, postId);
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

export async function destory(req, res) {
  console.log(req.params.id);
  let post = res.locals.post;
  const id = req.params.id;
  await commentsRepository.destoryUpdate(id);
  res.redirect("/posts/" + post.id + res.locals.getPostQueryString());
}