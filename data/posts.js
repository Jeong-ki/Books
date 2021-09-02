import { db } from "../db/database.js";

export async function getAll() {
  return db.execute("SELECT * FROM posts ORDER BY createdAt DESC").then((result) => result[0]);
}

export async function getById(id) {
  return db
    .execute("SELECT * FROM posts WHERE id=?", [id])
    .then((result) => result[0][0]);
}

export async function getByAuthor(author) {
  return db
    .execute("SELECT * FROM posts WHERE author=?", [author])
    .then((result) => result[0]);
}

export async function create(title, description, category, author) {
  return db
    .execute(
      "INSERT INTO posts (title, description, category, author) VALUES(?, ?, ?, ?)",
      [title, description, category, author]
    )
    .then((result) => getById(result[0].insertId));
}

export async function update(id, title, description, category, updatedAt) {
  return db
    .execute(
      "UPDATE posts SET title=?, description=?, category=?, updatedAt=? WHERE id=?",
      [title, description, category, updatedAt, id]
    )
    .then(() => getById(id));
}

export async function updateAuthor(nickname, currentNickname) {
  return db
    .execute(
      "UPDATE posts SET author=? WHERE author=?",
      [nickname, currentNickname]
    )
    .then(() => getByAuthor(nickname));
}

export async function destory(id) {
  return (
    db.execute("DELETE FROM posts WHERE id=?", [id])
  );
}