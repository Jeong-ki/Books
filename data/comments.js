import { db } from "../db/database.js";

export async function getPostId(id) {
  return db
    .execute("SELECT * FROM comment WHERE postId=?", [id])
    .then((result) => result[0]);
}

export async function getByCommentId(id) {
  return db
    .execute("SELECT * FROM comment WHERE commentId=?", [id])
    .then((result) => result[0][0]);
}

export async function create(username, text, postId) {
  return db
    .execute(
      "INSERT INTO comment (username, text, postId) VALUES(?, ?, ?)",
      [username, text, postId]
    )
    .then((result) => result[0][0]);
}

export async function update(text, updatedAt, id) {
  return db
    .execute(
      "UPDATE comment SET text=?, updatedAt=? WHERE commentId=?",
      [text, updatedAt, id]
    )
    .then((result) => result[0][0]);
}

export async function destoryUpdate(id) {
  return db
    .execute(
      "UPDATE comment SET isDeleted=1 WHERE commentId=?",
      [id]
    )
    .then((result) => result[0][0]);
}

export async function destory(id) {
  return (
    db.execute("DELETE FROM comment WHERE postId=?", [id])
  );
}