var gachi = (function (gachi, $, firebase) {

  var $ = $;
  var firebase = firebase;

  gachi.initFirebaseApp = function () {
    var config = {
      apiKey: "AIzaSyDAAJDFPXgHl5SFjaV6HFiEOCWySb48lro",
      authDomain: "gachi-test.firebaseapp.com",
      databaseURL: "https://gachi-test.firebaseio.com",
      projectId: "gachi-test",
      storageBucket: "gachi-test.appspot.com",
      messagingSenderId: "48888243317"
    };
    firebase.initializeApp(config);
  };

  gachi.retrieveUserInfo = function () {
    // returns observable handler
    return firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var fbid = user.uid;
        var uid = null;
        var headers = null;
        user.getIdToken()
          .then(function (token) {
            headers = gachi.authHeader(token);
            // find user id
            $.ajax({
              type: 'GET',
              url: gachi.GACHI_URL + 'v1/user/' + 'login',
              dataType: 'json',
              headers
            })
              .then(function (data) {
                uid = data.uid;
                // retrieve user info
                return $.ajax({
                  type: 'GET',
                  url: gachi.GACHI_URL + 'v1/user/' + uid,
                  dataType: 'json',
                  headers
                });
              })
              .then(function (data) {
                // 로그인 성공
                console.log(data);
              }).fail(function (err) {
                console.error(JSON.stringify(err));
              });
          })
          .catch(function (err) {
            // 로그인 에러
            console.error(err);
          });

      } else {
        console.log("로그인 안했음");
      }
    });
  };

  return gachi;
}(gachi || {}, $, firebase));