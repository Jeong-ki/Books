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