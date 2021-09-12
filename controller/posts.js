import * as postsRepository from "../data/posts.js";
import * as commentsRepository from "../data/comments.js";
import aws from "aws-sdk";
import path from "path";
const __dirname = path.resolve();
aws.config.loadFromPath(__dirname + "/config/s3.json");
const s3 = new aws.S3();




export async function index(req, res) {
  let page = Math.max(1, parseInt(req.query.page));
  let limit = Math.max(1, parseInt(req.query.limit)); // 한 페이지당 보여줄 게시물 수
  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:10;

  let searchQuery = createSearchQuery(req.query);
  let count;
  let posts;
  let skip = (page-1)*limit;

  if(Object.keys(searchQuery).length) {  // Searchquery가 있으면 실행
    let { title, body, author } = searchQuery.postQueries;
    let sTitle = title ? title : "No Title...";
    let sBody = body ? body : "No Description...";
    let sAuthor = author ? author : "No Author...";
    count = await postsRepository.countSearchPost(sTitle, sBody, sAuthor);
    posts = await postsRepository.searchPostPage(sTitle, sBody, sAuthor, skip, limit);
  } else {
    count = await postsRepository.countAllPost();  // 전체 게시물 수
    posts = await postsRepository.postPage(skip, limit);
  }
  let maxPage = Math.ceil(count.num/limit); // 전체 페이지 수

  res.render('posts/index', {
    posts: posts,
    currentPage: page,
    maxPage: maxPage,
    limit: limit,
    searchType:req.query.searchType,
    searchText:req.query.searchText
  });
}

export async function create(req, res) {
  const author = res.locals.user.id;
  const { title, description, category } = req.body;
  const files = req.files;
  let haveFile = true;

  if(!(title && category)) {
    res.redirect("/posts/create" + res.locals.getPostQueryString());
  }

  if (files.length) {
    await postsRepository.create(title, description, category, author, haveFile);
    const lastId = await postsRepository.lastId();
    const postId = lastId.id;
    for (let i = 0; i < files.length; i++) {
      let originalname = files[i].originalname;
      let key = files[i].key;
      let size = files[i].size;
      let versionId = files[i].versionId;
      await postsRepository.fileCreate(originalname, key, size, author, postId, versionId);
    }
  } else {
    await postsRepository.create(title, description, category, author, haveFile=false);
  }

  res.redirect("/posts" + res.locals.getPostQueryString(false, { page:1, searchText:'' }));
}

export async function show(req, res) {
  const id = req.params.id;
  await postsRepository.views(id);
  const post = await postsRepository.getById(id);
  const files = await postsRepository.getByFiles(id);
  const comments = await commentsRepository.getPostId(id);
  if (files.length) {
    for (let i = 0; i < files.length; i++) {
      let byteSize = bytesToSize(files[i].size)
      files[i].byteSize = byteSize;
    }
  }
  res.render("posts/show", { post: post, comments: comments, files: files });
}

export async function edit(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  const files = await postsRepository.getByFiles(id);

  if (files.length) {
    for (let i = 0; i < files.length; i++) {
      let byteSize = bytesToSize(files[i].size)
      files[i].byteSize = byteSize;
    }
  }
  if (res.locals.user.id === post.author) {
    res.render("posts/edit", { post: post, files: files });
  } else {
    res.redirect("/posts/"+ id + res.locals.getPostQueryString());
  }
}

export async function update(req, res) {
  const uploadedBy = res.locals.user.id;
  const id = req.params.id;
  req.body.updatedAt = new Date();
  const { title, description, category, updatedAt } = req.body;
  const beforeFile = req.body.files;
  const files = req.files;
  console.log("beforeFiles", beforeFile);
  console.log("newfiles", files);
  let haveFile = true;

  if(!(title && category)) {
    res.redirect("/posts/" + id + res.locals.getPostQueryString());
  }

  if (files.length) {
    // S3파일 삭제 후 DB삭제
    s3_delete(id);
    await postsRepository.fileDestroy(id);

    for (let i = 0; i < files.length; i++) {
      let originalname = files[i].originalname;
      let key = files[i].key;
      let size = files[i].size;
      let versionId = files[i].versionId;
      await postsRepository.fileCreate(originalname, key, size, uploadedBy, id, versionId);
    }
    await postsRepository.update(id, title, description, category, updatedAt, haveFile);
  } else if(beforeFile){
    await postsRepository.update(id, title, description, category, updatedAt, haveFile);
  } else {
    s3_delete(id);
    await postsRepository.fileDestroy(id);
    await postsRepository.update(id, title, description, category, updatedAt, haveFile=false);
  }

  res.redirect("/posts/" + id + res.locals.getPostQueryString());
}

export async function destroy(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  const comments = await commentsRepository.getPostId(id);

  if (res.locals.user.id === post.author) {
    s3_delete(id);
    await postsRepository.destroy(id);
    await postsRepository.fileDestroy(id);
    if(comments) await commentsRepository.destroy(id);
    res.redirect('/posts' + res.locals.getPostQueryString());
  } else {
    res.redirect("/posts");
  }
}

function createSearchQuery(queries){
  let searchQuery = {};
  if(queries.searchType && queries.searchText && queries.searchText.length >= 2){
    let searchTypes = queries.searchType.toLowerCase().split(',');
    let postQueries = {};
    if(searchTypes.indexOf('title')>=0){
      postQueries.title = queries.searchText;
    }
    if(searchTypes.indexOf('body')>=0){
      postQueries.body = queries.searchText;
    }
    if(searchTypes.indexOf('author!')>=0){
      postQueries.author = queries.searchText;
    } else if(searchTypes.indexOf('author')>=0) {
      postQueries.author = queries.searchText;
    }
    console.log(Object.keys(postQueries).length);
    if(Object.keys(postQueries).length > 0) searchQuery = {postQueries};
  }
  return searchQuery;
}

function bytesToSize(bytes) {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

async function s3_delete(id) {
  let params = {
    Bucket: "jksbook", 
    Delete: { Objects: null, Quiet: false, },
  };
  const filesKeyValue = await postsRepository.filesKeyValue(id);
  params.Delete.Objects = filesKeyValue;
  s3.deleteObjects(params, function(err, data) {
    if (err) console.log("삭제시 에러: " + err, err.stack); // an error occurred
    else console.log("삭제: ", data);  // successful response
  });
}