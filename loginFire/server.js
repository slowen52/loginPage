var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inclassapp-c769a.firebaseio.com"
});

app.get('/',function(req,res){
    res.render('login');
});
var db = admin.database();

var ref = db.ref('users');

ref.once('value', function(snapshot){
    console.log(snapshot.val()) 
});

app.listen(3001, function(){
    console.log('app is running on port 3001')
})


app.post('/', function(req,res){
    var email = req.body.username;
    console.log(email)
    var password = req.body.password;
    ref.push({
        user:{
        username: email,
        password: password
            }
    })
    console.log(email + " " + password)
    function finished(err){
        console.log('all set!');
        res.redirect('/app/'+email);
        var reply = {
            msg: "Your contact has been added"
        }
    }
    
})

