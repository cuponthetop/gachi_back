var gachi = (function (gachi, $, firebase) {

  var $ = $;
  var firebase = firebase;

  gachi.emailLogin = function (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        var errorCode = error.code;
        if (errorCode == "auth/user-not-found") {
          alert("등록된 정보가 없습니다.");
        }

        if (errorCode == "auth/wrong-password") {
          alert("비밀번호를 잘못 입력하셨습니다");
        }
      });
  }

  gachi.facebookLogin = function () {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }


  return gachi;
}(gachi || {}, $, firebase));