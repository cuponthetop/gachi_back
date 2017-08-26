var gachi = (function (gachi, $) {

  var $ = $;
  gachi.GACHI_URL = "http://cuponthetop.com/gachi/api/";
  // gachi.GACHI_URL = "http://localhost:3003/api/";

  gachi.authHeader = function (token) {
    return { authorization: 'Bearer ' + token };
  };

  return gachi;
}(gachi || {}, $));