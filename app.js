
var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var request = require('request');
var config = require("./config.js")

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

var fs = require('fs');
var data = fs.readFileSync('data.json');
var userDB = JSON.parse(data);

app.set('view engine', 'ejs');

//var word = "soliloquy"
app.listen(3000, function(){
    console.log('app is running on port 3000')
})

app.get('/',function(req,res){
    res.render('login');
});

app.post('/', function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    console.log(email + " " + password)
    userDB[email] = password;
    var data = JSON.stringify(userDB);
    fs.writeFile('data.json',data,finished);
    function finished(err){
        console.log('all set!');
        res.redirect('/app/'+password);
        var reply = {
            msg: "Your contact has been added"
        }
    }
    
})




app.get('/app/:password', function (req, res) {
  res.render('index', {info: null, name: req.params.password, error: null});
})




app.post('/app/:password', function (req, res) {
    var word = req.body.word;
    console.log(word)

    var options = {
    url : "https://wordsapiv1.p.mashape.com/words/"+word+"/definitions",
    headers:{
        'X-Mashape-Key': config.apikey,
        'Accept': "application/json"
        }
};

    request(options, function (err, response, body) {
    if(err){
      res.render('index', {info: null, name: req.params.password, error: 'Error, please try again'});
    } else {
      var info = JSON.parse(body)
      //console.log(info)
        var definition = info.definitions[0].definition
      if(definition == undefined){
        res.render('index', {info: null, error: 'Error, please try again'});
      } else {
        var message = "The definition of "+ info.word + " is " + info.definitions[0].definition;
        res.render('index', {info: message, name: req.params.password, error: null});
      }
    }
  });
})


