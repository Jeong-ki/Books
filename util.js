export function getPostQueryString(req, res, next) {
  res.locals.getPostQueryString = function(isAppended=false, overwrites={}){    
    var queryString = '';
    var queryArray = [];
    var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
    var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');

    if(page) queryArray.push('page='+page);
    if(limit) queryArray.push('limit='+limit);

    if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

    return queryString;
  }
  next();
}

// util.getPostQueryString = function(req, res, next){
//   res.locals.getPostQueryString = function(isAppended=false, overwrites={}){    
//     var queryString = '';
//     var queryArray = [];
//     var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
//     var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');

//     if(page) queryArray.push('page='+page);
//     if(limit) queryArray.push('limit='+limit);

//     if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

//     return queryString;
//   }
//   next();
// }