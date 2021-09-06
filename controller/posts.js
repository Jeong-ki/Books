import * as postsRepository from "../data/posts.js";
import * as userRepository from "../data/users.js";

export async function index(req, res) {
  console.log("req.query: ", req.query);
  let page = Math.max(1, parseInt(req.query.page));
  let limit = Math.max(1, parseInt(req.query.limit)); // 한 페이지당 보여줄 게시물 수
  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:10;

  let searchQuery = createSearchQuery(req.query);
  console.log("searchQuery: ", searchQuery);
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
  console.log(title, description, category);
  if(!(title && category)) {
    res.redirect("/posts/create" + res.locals.getPostQueryString());
  } else {
    await postsRepository.create(title, description, category, author);
    res.redirect("/posts" + res.locals.getPostQueryString(false, { page:1, searchText:'' }));
  }
}

export async function show(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  console.log(post);
  res.render("posts/show", { post: post });
}

export async function edit(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  if (res.locals.user.id === post.author) {
    res.render("posts/edit", { post: post });
  } else {
    res.redirect("/posts/"+ id + res.locals.getPostQueryString());
  }
}
export async function update(req, res) {
  const id = req.params.id;
  req.body.updatedAt = new Date();
  const { title, description, category, updatedAt } = req.body;
  await postsRepository.update(id, title, description, category, updatedAt);
  res.redirect("/posts/" + id + res.locals.getPostQueryString());
}

export async function destory(req, res) {
  const id = req.params.id;
  const post = await postsRepository.getById(id);
  if (res.locals.user.id === post.author) {
    await postsRepository.destory(id);
    res.redirect('/posts' + res.locals.getPostQueryString());
  } else {
    res.redirect("/posts");
  }
}

function createSearchQuery(queries){
  let searchQuery = {};
  if(queries.searchType && queries.searchText && queries.searchText.length >= 3){
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