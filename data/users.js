import { db } from "../db/database.js";

export async function create(email, nickname, password) {
  return db
    .execute(
      "INSERT INTO users (email, nickname, password) VALUES(?, ?, ?)",
      [email, nickname, password]
    )
    .then((result) => result[0]);
}