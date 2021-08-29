import express from "express";
import * as postsController from "../controller/posts.js";

const router = express.Router();

// posts
// index
router.get("/", postsController.index);

// create
router.get("/create", function (req, res) {
  res.render("posts/create");
});
router.post("/", postsController.create);

// show
router.get("/:id", postsController.show);

// edit
router.get("/:id/edit", postsController.edit);
router.put("/:id", postsController.update);

// delete
router.delete('/:id', postsController.destory);

export default router;
