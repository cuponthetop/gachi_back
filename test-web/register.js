registerButton.click(function () {
  var email = emailInput.val();
  var password = passwordInput.val();
  var nickname = nicknameInput.val();

  passwordInput.val("");

  $.post(gachi + "/user", {
    nickname: nickname,
    provider: "email",
    email: email,
    password: password
  }, function (result, status) {
    console.log('create successful + ' + JSON.stringify(result));
    nicknameInput.val("");
    registerButton.hide();
    nicknameInput.hide();
  });
  // send req then show result
});
