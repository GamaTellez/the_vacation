require('dotenv').config();

const bcrypt = require('bcrypt');
const connectionString = process.env.DATABASE_URL;    
const Pool = require('pg-pool');
const pool = new Pool({connectionString: connectionString});
var attendee = require('./vacation_attendee');
var vac = require('./vacation');

function get_all_vacations(callback) {
    var sql_vacations_query = "SELECT * FROM vacation";
    pool.query(sql_vacations_query, async function(error, vacations_query_result) { // async
      if (error) {
        console.log("error in vacations query " + error);
        return callback(error); // return to break process
      }
        var all_complete = await loop_through_vacations(vacations_query_result.rows, pool); // await
        callback(null, all_complete);
    });
  }

  async function loop_through_vacations(vacations_incomplete, pool) {
    var all_vacations = [];
    var promises_creator = []; // store all promise
    var promises_votes = [];
    for (var vacation_data of vacations_incomplete) {
      var vacation_at_index = new vac.Vacation(vacation_data.id, vacation_data.destination, vacation_data.description, vacation_data.attendee_creator_id);
      promises_creator.push( // push your promise to a store - promises
        vacation_at_index.find_creator(pool)
            .then((vacation) => {
                all_vacations.push(vacation);
            })
            .catch((err) => {
                console.log(err);
            })
        );
        promises_votes.push(
            vacation_at_index.find_votes(pool)
            .then((vacation_with_vote)=> {
            })
            .catch((err)=> {
                console.log(err);
            })
        );
    }
    await Promise.all(promises_creator); // wait until all promises finished
    await Promise.all(promises_votes);
    return all_vacations;
  }

//   async function loop_through_vacations(vacations_incomplete, pool) {
//     var all_vacations = [];
//     var promises = []; // store all promise
//     for (var vacation_data of vacations_incomplete) {
//       var vacation_at_index = new vac.Vacation(vacation_data.id, vacation_data.destination, vacation_data.description, vacation_data.attendee_creator_id);
//       promises.push( // push your promise to a store - promises
//         vacation_at_index.find_creator(pool)
//           .then((vacation) => {
//             all_vacations.push(vacation)
//           })
//           .catch((err) => {
//             console.log(err);
//           })

//       );
//     }
//     await Promise.all(promises); // wait until all promises finished
//     return all_vacations;
//   }

module.exports = {

    render_home_page: function home_page(request,response) {
        response.render('the_vacation.ejs', { vacations : undefined, current_user:undefined });                  
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
                var new_current_user = new attendee.VacationAttendee(full_name, email);
                current_session.current_user = new_current_user;
                response.render('the_vacation.ejs', { vacations : current_session.vacations , current_user:new_current_user });           
            });
        } else {
            console.log("miss matching passwords");       
        }
    },

    sign_in: function sign_in(request, response) {
        var user_email = request.query.email_login;
        var user_password = request.query.password_login;

        if (user_email && user_password) {
            const login_query = "SELECT * FROM vacation_attendee WHERE email = lower('" + user_email + "')";
            pool.query(login_query, function(error, result) {
                if (error) {
                    console.log("error with login query --->" + error);
                } 
                if (result.rows.length == 1) {
                    bcrypt.compare(user_password, result.rows[0].password_hash, function(error, password_verified) {
                        if (error) {
                            console.log("error with hash comparison --> " + error);
                        } 
                        if (password_verified) {
                            var new_current_user = new attendee.VacationAttendee(result.rows[0].full_name, result.rows[0].email);
                            request.session.current_user = new_current_user;
                            get_all_vacations(function(error, vacations) {
                                if (error) {
                                    console.log(error);
                                }
                                console.log(vacations);
                                response.render('the_vacation.ejs', { vacations : vacations, current_user:new_current_user });           
                            });
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


}





