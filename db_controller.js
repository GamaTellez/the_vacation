require('dotenv').config();

const bcrypt = require('bcrypt');
const connectionString = process.env.DATABASE_URL;    
const Pool = require('pg-pool');
const pool = new Pool({connectionString: connectionString});
var classes = require('./classes');

module.exports = {

    get_vacations: function get_vacations(request, response, current_session) {
        var sql_vacations_query = "SELECT * FROM vacation";    
        pool.query(sql_vacations_query, function(error, vacations_result) {        
            if (error) throw error;
            current_session.vacations = vacations_result.rows;
            response.render('the_vacation.ejs', { vacations : current_session.vacations, current_user:current_session.current_user });                  
        });
    },

    sign_up: function signup_new_user(request, response, current_session) {
        if (request.query.password == request.query.password_repeat) {
            var password = request.query.password;
            var email = request.query.email;
            var full_name = request.query.full_name;

            var hashed_pass = bcrypt.hashSync(password, 10);
            const insert_new_user_query = "INSERT INTO vacation_attendee (full_name, email, password_hash) VALUES (" + "'" + full_name + "'" +", " + "'" + email + "'" +"," + "'" + hashed_pass + "'" + ")"; 
            console.log(insert_new_user_query);
            pool.query(insert_new_user_query, function(error, result) 
            {   
                if (error) {
                    console.log(error);
                    throw error;  
                } 
                var new_current_user = new classes.VacationAttendee(full_name, email);
                current_session.current_user = new_current_user;
                response.render('the_vacation.ejs', { vacations : current_session.vacations , current_user:new_current_user });           
            });
        } else {
            console.log("no matching password");
            alert("The passwords don't match");
        }
    },

    sign_in: function sign_in(request, response, current_session) {
        var user_email = request.query.email_login;
        var user_password = request.query.password_login;

        if (user_email && user_password) {
            const login_query = "SELECT * FROM vacation_attendee WHERE email = lower('" + user_email + "')";
            console.log(login_query);
            pool.query(login_query, function(error, result) {
                if (error) {
                    console.log("error with login query --->" + error);
                    throw error;
                } 
                console.log(result);
                if (result.rows.length == 1) {
                    bcrypt.compare(user_password, result.rows[0].password_hash, function(error, password_verified) {
                        if (error) {
                            console.log("error with hash comparison --> " + error);
                            throw error;
                        } 
                        if (password_verified) {
                            var new_current_user = new classes.VacationAttendee(result.rows[0].full_name, result.rows[0].email);
                            current_session.current_user = new_current_user;
                            console.log("user logged in successfully");
                            response.render('the_vacation.ejs', { vacations : current_session.vacations , current_user:new_current_user });           
                        } else {
                            console.log("password is incorrect");
                        }
                    });
                } else {
                    console.log("user not found");
                }
            });          
        }
    },

    sign_out: function sign_out(request, response) {

    }
}



