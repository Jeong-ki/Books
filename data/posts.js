import { db } from "../db/database.js";

export async function getAll() {
  return db.execute("SELECT * FROM posts").then((result) => result[0]);
}

export async function getById(id) {
  return db
    .execute("SELECT * FROM posts WHERE id=?", [id])
    .then((result) => result[0][0]);
}

export async function create(title, description) {
  return db
    .execute(
      "INSERT INTO posts (title, description) VALUES(?, ?)",
      [title, description]
    )
    .then((result) => getById(result[0].insertId));
}

export async function update(id, title, description, updatedAt) {
  return db
    .execute(
      "UPDATE posts SET title=?, description=?, updatedAt=? WHERE id=?",
      [title, description, updatedAt, id]
    )
    .then(() => getById(id));
}

export async function destory(id) {
  return (
    db.execute("DELETE FROM posts WHERE id=?", [id])
  );
}