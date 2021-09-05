export function getPostQueryString(req, res, next) {
  res.locals.getPostQueryString = function(isAppended=false, overwrites={}){    
    let queryString = '';
    let queryArray = [];
    let page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
    let limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');
    let searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:'');
    let searchText = overwrites.searchText?overwrites.searchText:(req.query.searchText?req.query.searchText:'');

    if(page) queryArray.push('page='+page);
    if(limit) queryArray.push('limit='+limit);
    if(searchType) queryArray.push('searchType='+searchType);
    if(searchText) queryArray.push('searchText='+searchText);

    if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

    return queryString;
  }
  next();
}