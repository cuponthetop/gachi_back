var express = require('express');
var app = express();

app.set('views', '../view');
app.set('view engine', 'ejs');

var data = [
    {title: 'cat1', name: 'one'},
    {title: 'cat2', name: 'two'},
    {title: 'cat3', name: 'three'},
]
app.use(express.static('./'));
app.get('/', function(req, res){
  res.render('test', {title:'고양이들', cats:data});
});

app.listen(3003);
