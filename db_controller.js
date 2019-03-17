require('dotenv').config();
const connectionString = process.env.DATABASE_URL;    
const Pool = require('pg-pool');
const pool = new Pool({connectionString: connectionString});

var classes = require('./classes');

module.exports = {
    get_vacations: function get_vacations(request, response) {
        var sql_vacations_query = "SELECT * FROM vacation";    
        pool.query(sql_vacations_query, function(error, vacations_result) {        
            if (error) throw error;
            response.render('the_vacation.ejs', { vacations : vacations_result.rows });              
        });
    }   
}



