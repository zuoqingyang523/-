let method = {
  // query:url上query原来的参数
  // newQuery:新加的query参数，如果没有新加的参数，传null,必须传
  NewQuery: function (query, newQuery) {
    return Object.assign({}, query, newQuery)
  }
}
export default method;