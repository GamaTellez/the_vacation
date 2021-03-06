const path = require('path')
const express = require('express')
const PORT = process.env.PORT || 5000;
var vacations_db_controller = require('./db_controller');
var app = express();
var session = require("express-session");
var bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Session

app.use(session({secret: 'ssshhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var current_session;

//get vacations function renders the homepage
app.get('/', function(request, response) {
      vacations_db_controller.render_home_page(request, response);
});

//handle sign up tapped
app.get('/sign_up', function(request, response) {
  current_session = request.session;
  vacations_db_controller.sign_up(request, response, current_session);
});

//handle sign in tap
app.get('/sign_in', function(request, response) {
    vacations_db_controller.sign_in(request, response);
});

app.get('/sign_out', function(request, response) {
    response.render('the_vacation.ejs', { vacations : undefined, current_user: undefined});  
});

if (PORT == null || PORT == "") {
  PORT = 5000;
  console.log("Listening to port 5000");
}
app.listen(PORT);


