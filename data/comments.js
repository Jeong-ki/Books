import { db } from "../db/database.js";

export async function getPostId(id) {
  return db
    .execute("SELECT * FROM comment WHERE postId=?", [id])
    .then((result) => result[0]);
}

export async function create(username, parentComment, text, isDeleted, postId) {
  return db
    .execute(
      "INSERT INTO comment (username, parentComment, text, isDeleted, postId) VALUES(?, ?, ?, ?, ?)",
      [username, parentComment, text, isDeleted, postId]
    )
    .then((result) => result[0][0]);
}