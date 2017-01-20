var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var path = require('path');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.post('/', function (req,res) {
  pg.connect('postgres://postgres:abc@localhost:5432/messages', function(err, client, done){
    console.log(req.body.title);
    client.query(`insert into message(title, textbody) values ('${req.body.title}','${req.body.message}')`,function(err,result){
      console.log(`insert into message(title, textbody) values ('${req.body.title}','${req.body.message}')`);
      res.redirect('/');
      done();
      pg.end();
    })
  })
})

app.get('/', function (req, res) {
  pg.connect('postgres://postgres:abc@localhost:5432/messages',function(err,client, done){
    client.query('select * from message',function(err, result){
      res.render('posts', {data:result.rows});
      done();
      pg.end();
    })
  })
})


app.get('/message/:id', function(req, res){
  pg.connect('postgres://postgres:abc@localhost:5432/messages', function(err, client,done){
    client.query(`select * from message where id ='${req.params.id}'`, function(err, result){
      console.log(err);
      res.render('review',{blog: result.rows[0]})
      console.log(result.rows)
      done();
      pg.end();
    })
  })
})



app.listen('3000', function(){
  console.log("Now listening to port no 3000.......");
})
