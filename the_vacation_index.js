const path = require('path')
const express = require('express')
const PORT = process.env.PORT || 5000;
var vacations_db_controller = require('./db_controller');
var app = express();
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');


app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (PORT == null || PORT == "") {
  PORT = 5000;
  console.log("Listening to port 5000");
} else {
  console.log("listening to port: " + PORT);

}
app.listen(PORT);

//Session

app.use(session({secret: 'ssshhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var session;

//get vacations function renders the homepage
app.get('/', function(request, response) {
      vacations_db_controller.render_home_page(request, response);
});

//handle sign up tapped
app.post('/sign_up', function(request, response) {
  vacations_db_controller.sign_up(request, response);
});

//handle sign in tap
app.post('/sign_in', function(request, response) {
    vacations_db_controller.sign_in(request, response);
});

app.get('/sign_out', function(request, response) {
    request.session.current_user = undefined;
    request.session.vacations = undefined;
    response.render('the_vacation.ejs', { vacations : undefined, current_user: undefined});  
});

app.post('/add_vacation', function(request, response){
    vacations_db_controller.add_vacation(request, response);
});

app.post('/add_vote', function(request, response){
    vacations_db_controller.add_vote(request, response);
});



