var db = firebase.database();
var room = db.ref('chat/room1');

postButton.click(function () {
  var msgUser = username;
  var msgText = textInput.val();
  room.push({ username: msgUser, text: msgText });

  textInput.val("");
});
