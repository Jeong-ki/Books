import express from "express";
import * as commentsController from "../controller/comments.js";
import * as postsRepository from "../data/posts.js";

const router = express.Router();

// comments
router.post("/", checkPostId, commentsController.create);
router.put("/:id", checkPostId, commentsController.update);
router.delete('/:id', checkPostId, commentsController.destory);

async function checkPostId(req, res, next) {
  let postId = req.query.postId;
  const post = await postsRepository.getById(postId);
  if(post) {
    res.locals.post = post;
    next();
  } else {
    res.status(400).json("no.. postId...");
  }
}

export default router;