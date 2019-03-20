const path = require('path')
const express = require('express')
const PORT = process.env.PORT || 5000;
var vacations_db_controller = require('./db_controller');
var app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//get vacations function renders the homepage
app.get('/', function(request, response) {
    vacations_db_controller.get_vacations(request, response);
});

//handle sign up tapped
app.get('/sign_up', vacations_db_controller.sign_up);

if (PORT == null || PORT == "") {
  PORT = 5000;
  console.log("Listening to port 5000");
}
app.listen(PORT);