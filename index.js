var express=require('express')
var http=require('http')
var path=require('path')
var bodyParser=require('body-parser')
const accountSid = 'AC938db0fbbf858506287ab5e499fdc88f';
const authToken = '2d4f88aca9b6147777acecdb7ff551c9';
const client = require('twilio')(accountSid, authToken);
var mysql=require('mysql')
var session=require('express-session');
var moment=require('moment')

var app=express()




app.use(session({secret: 'ssshhhhh',saveUninitialized: true, resave:true}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('port',process.env.PORT || 3000)
app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))

var con=mysql.createConnection({host:'localhost', user: 'root', password: '',database: 'hack'});

var sess;


app.get('/',function(req,res){
  res.render('index')
})

app.get('/aefi',function(req,res){

  var sql="select * from afei"
  con.query(sql,function(err,result){
    res.render('afei',{data:result})
  })

})

app.get('/p_vaccines',function(req,res){

  var sql="select * from child_vaccines where Status=1"



  con.query(sql,function(err,result){

    res.render('p_vaccine',{vaccdone: result})


})
})

app.get('/msg',function(req,res){
  client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+12055395790',
     to: '+917023512792'
   })
  .then(message => console.log(message.sid));res.redirect('/second');

})

app.get('/login:id',function(req,res,next){
  //console.log(req.params.id);
  res.render('login',{id:req.params.id})
})

app.get('/register_mother',function(req,res){
  res.render('reg_mother')
})

app.get('/register_child',function(req,res){
  res.render('reg_child')
})

app.get('/reminders',function(req,res){
  res.render('reminders')
})

app.post('/logout',function(req,res){
  res.render('index')
})

app.post('/reg_mother_data',function(req,res){

  sess=req.session;
  var sql="insert into mother_info(name,husname,aadhar,date,pweight,phone,password) values('"+req.body.name+"','"+req.body.hus_name+"','"+req.body.aadhar_name+"','"+req.body.birthday+"','"+req.body.weight+"','"+req.body.phone+"','"+req.body.password+"' )";
  ////console.log(req.body);
  ////console.log(req.body.name[2])
  con.query(sql,function(err,result){
    if (err)
    throw err;

    //console.log("inserted")
  })
  res.render('second');
})

app.post('/reg_child_data',function(req,res){
  sess=req.session;
  var sql="insert into child_info(name,nameparent,aadhar,date,gender,weight,phone,password,bcno) values('"+req.body.name+"','"+req.body.pname+"','"+req.body.adno+"','"+req.body.birthday+"','"+req.body.gender+"','"+req.body.pweight+"','"+req.body.pno+"','"+req.body.pass+"','"+req.body.bcno+"' )";
  ////console.log(req.body);
  ////console.log(req.body.name[2])
  var sql1="insert into child_vaccines(bcno,date) values('"+req.body.bcno+"','"+req.body.birthday+"' )";

  sess.date=req.body.birthday;


  con.query(sql,function(err,result){
    if (err)
    throw err;

    //console.log("inserted")
  })
  con.query(sql1,function(err,result){
    if (err)
    throw err;

    //console.log("inserted")
  })
  res.render('second');
})


app.post('/geolocation',function(req,res){
  //console.log(req.body)
  if(req.body.city.toLowerCase() == 'patiala')
  res.render('geolocation')
})

app.get('/second',function(req,res){
  res.render('second');
})


app.get('/pg',function(req,res){
  res.render('pg')
})

var record;
app.post('/auth:id',function(req,res,next){

  sess=req.session;

  //console.log(req.params.id)



    var sql="select * from child_vaccines where Status=0"



    con.query(sql,function(err,result){
      //console.log(result.length)
      //console.log(result)
      res.render('timeline',{vaccleft: result})

    })
  })












app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

http.createServer(app).listen(app.get('port'),function(){
  //console.log('listening to port:'+ app.get('port'))
})
