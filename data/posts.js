import { db } from "../db/database.js";

export async function getAll() {
  return db.execute("SELECT * FROM posts ORDER BY createdAt DESC").then((result) => result[0]);
}

export async function postPage(skip, limit) {
  return db
  .execute(`SELECT posts.*, COUNT(postId) as commentCount, @rownum:=@rownum+1 AS num
            FROM posts LEFT JOIN comment ON posts.id=comment.postId, (SELECT @rownum:=0) TMP
            GROUP BY posts.id
            ORDER BY createdAt DESC LIMIT ?, ?`, [skip+"", limit+""])
  .then((result) => result[0]);
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

export async function views(id) {
  return db
    .execute(
      "UPDATE posts SET views = views+1 WHERE id=?",
      [id]
    )
    .then(() => getById(id));
} 

export async function create(title, description, category, author, haveFile) {
  return db
    .execute(
      "INSERT INTO posts (title, description, category, author, haveFile) VALUES(?, ?, ?, ?, ?)",
      [title, description, category, author, haveFile]
    )
    .then((result) => getById(result[0].insertId));
}

export async function update(id, title, description, category, updatedAt, haveFile) {
  return db
    .execute(
      "UPDATE posts SET title=?, description=?, category=?, updatedAt=?, haveFile=? WHERE id=?",
      [title, description, category, updatedAt, haveFile, id]
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

export async function destroy(id) {
  return (
    db.execute("DELETE FROM posts WHERE id=?", [id])
  );
}

export async function countAllPost() {
  return (
    db.execute("SELECT COUNT(*) as num FROM posts")
    .then((result) => result[0][0]));
}

// Search
export async function getByFiles(id) {
  return db
    .execute("SELECT * FROM file WHERE postId=?", [id])
    .then((result) => result[0]);
}

export async function countSearchPost(title, body, author) {
  return (
    db.execute(`SELECT COUNT(*) as num FROM posts WHERE title like '%${title}%' OR description like '%${body}%' OR author like '%${author}%'`)
    .then((result) => result[0][0]));
}

export async function searchPostPage(title, body, author, skip, limit) {
  return db
  .execute(`SELECT posts.* , count(postId) as commentCount, @rownum:=@rownum+1 AS num
            FROM posts LEFT JOIN comment ON posts.id=comment.postId, (SELECT @rownum:=0) TMP
            WHERE title like '%${title}%' OR description like '%${body}%' OR author like '%${author}%' 
            GROUP BY posts.id
            ORDER BY createdAt DESC LIMIT ?, ?`, [skip+"", limit+""])
  .then((result) => result[0]);
}

// file
export async function fileCreate(originalname, key, size, uploadedBy, postId, versionId) {
  return db
    .execute(
      "INSERT INTO file (originalFileName, serverFileName, size, uploadedBy, postId, versionId) VALUES(?, ?, ?, ?, ?, ?)",
      [originalname, key, size, uploadedBy, postId, versionId]
    )
    .then((result) => getById(result[0].insertId));
}

export async function lastId() {
  return db
    .execute("SELECT id FROM posts order by id desc limit 1")
    .then((result) => result[0][0]);
}

export async function filesKeyValue(id) {
  return db
    .execute("SELECT serverFileName as 'Key', versionId as 'VersionId' FROM file WHERE postId=?", [id])
    .then((result) => result[0]);
}

export async function fileDestroy(id) {
  return (
    db.execute("DELETE FROM file WHERE postId=?", [id])
  );
}