const path = require('path')
const express = require('express')
const PORT = process.env.PORT || 5000;
var vacations_db_controller = require('./db_controller');
var app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//home page load
app.get('/', function(request, response) {
    //get vacations function renders the homepage
    vacations_db_controller.get_vacations(request, response);
});

//app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
if (PORT == null || PORT == "") {
  PORT = 5000;
  console.log("Listening to port 5000");
}
app.listen(PORT);