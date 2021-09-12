import { db } from "../db/database.js";

export async function create(user) {
  const { email, nickname, password } = user;
  return db
    .execute(
      "INSERT INTO users (email, nickname, password) VALUES(?, ?, ?)",
      [email, nickname, password]
    )
    .then((result) => result[0]);
}

export async function findByEmail(email) {
  return db
    .execute("SELECT * FROM users WHERE email=?", [email])
    .then((result) => result[0][0]);
}

export async function findByNickname(nickname) {
  return db
    .execute("SELECT * FROM users WHERE nickname=?", [nickname])
    .then((result) => result[0][0]);
}

export async function update(user) {
  const { currentNickname, email, nickname, password } = user;
  return db
    .execute(
      "UPDATE users SET email=?, nickname=?, password=? WHERE nickname=?",
      [email, nickname, password, currentNickname]
    )
    .then((result) => result[0]);
}

export async function destroy(nickname) {
  return (
    db.execute("DELETE FROM users WHERE nickname=?", [nickname])
  );
}