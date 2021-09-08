import * as commentsRepository from "../data/comments.js";

export async function create(req, res) {
  let post = res.locals.post;
  console.log(res.locals.user.id);
  console.log(post);
  console.log("req.body: ", req.body);
  const username = res.locals.user.id;
  const postId = post.id;
  const text = req.body.text;
  const parentComment = null;  // 임시
  const isDeleted = null; // 임시

  await commentsRepository.create(username, parentComment, text, isDeleted, postId);

  res.redirect("/posts/" + post.id + res.locals.getPostQueryString());
}