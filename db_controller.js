require('dotenv').config();

const bcrypt = require('bcrypt');
const connectionString = process.env.DATABASE_URL;    
const Pool = require('pg-pool');
const pool = new Pool({connectionString: connectionString});
const query_string = require('querystring');
var classes = require('./classes');

module.exports = {
    get_vacations: function get_vacations(request, response) {
        var sql_vacations_query = "SELECT * FROM vacation";    
        pool.query(sql_vacations_query, function(error, vacations_result) {        
            if (error) throw error;
            response.render('the_vacation.ejs', { vacations : vacations_result.rows });              
        });
    },
    //vacation_attendee
    // Column     |         Type          |
    // ----------------+-----------------------+        
    //  id             | integer               |
    //  full_name      | character varying(50) |
    //  email          | character varying(50) |
    //  password_hash   | character varying(50) |
    //  last_vote_date | date                  |

    sign_up: function signup_new_user(request, response) {
        if (request.query.password == request.query.password_repeat) {
            var password = request.query.password;
            var email = "'" + request.query.email + "'";
            var full_name = "'" + request.query.full_name + "'";

            var hashed_pass = "'" + bcrypt.hashSync(password, 10) + "'";
            const insert_new_user_query = "INSERT INTO vacation_attendee (full_name, email, password) VALUES (" +  full_name + ", " + email + ", " + hashed_pass + ")"; 
            console.log(insert_new_user_query);
            // pool.query(insert_new_user_query, function(error, result) 
            // {   
            //     if (error) {
            //         console.log(error);
            //         throw error;  
            //     } 
            //     console.log(result);
            // });
        } else {
            console.log("no matching password");
            alert("The passwords don't match");
        }
    }
}



