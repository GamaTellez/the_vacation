const path = require('path')
const express = require('express')
const PORT = process.env.PORT || 5000;
var vacations_db_controller = require('./db_controller');
var app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//to look for the url
app.get('/', function(request, response) {
    vacations_db_controller.get_vacations(request, response);
    // response.render('the_vacation.ejs');
});

// app.get('/load_all_vacations', vacations_db.get_vacations_request);

//app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
if (PORT == null || PORT == "") {
  PORT = 5000;
}
app.listen(PORT);