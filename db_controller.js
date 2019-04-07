require('dotenv').config();

const bcrypt = require('bcrypt');
const connectionString = process.env.DATABASE_URL;
const Pool = require('pg-pool');
const pool = new Pool({ connectionString: connectionString });
var attendee = require('./vacation_attendee');
var vac = require('./vacation');

function get_all_vacations(callback) {
    var sql_vacations_query = "SELECT * FROM vacation";
    pool.query(sql_vacations_query, async function (error, vacations_query_result) { // async
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
                .then((vacation_with_vote) => {
                })
                .catch((err) => {
                    console.log(err);
                })
        );
    }
    await Promise.all(promises_creator); // wait until all promises finished
    await Promise.all(promises_votes);
    return all_vacations;
}

module.exports = {

    render_home_page: function home_page(request, response) {
        response.render('the_vacation.ejs', { vacations: undefined, current_user: undefined });
    },

    sign_up: function signup_new_user(request, response) {
        if (request.body.password == request.body.password_repeat) {
            var password = request.body.password;
            var email = request.body.email;
            var full_name = request.body.full_name;

            console.log("password entered= " + password);

            var hashed_pass = bcrypt.hashSync(password, 10);
            const insert_new_user_query = "INSERT INTO vacation_attendee (full_name, email, password_hash) VALUES (" + "'" + full_name + "'" + ", " + 
                                                                                                                    "'" + email + "'" + "," + "'" +
                                                                                                                     hashed_pass + "'" + ") RETURNING id";
            pool.query(insert_new_user_query, function (error, result) {
                if (error) {
                    console.log(error);
                    response.render('the_vacation.ejs', { vacations: undefined, current_user: undefined });
                }
                var new_current_user = new attendee.VacationAttendee(full_name, email, undefined, result.rows[0].id);
                get_all_vacations(function (error, vacations) {
                    if (error) { throw error; }
                    request.session.vacations = vacations;
                    request.session.current_user = new_current_user;
                    // console.log(request.session.current_user);
                    // console.log(request.session.vacations);
                    response.render('the_vacation.ejs', { vacations: request.session.vacations, current_user: request.session.current_user });
                });
            });
        } else {
            console.log("miss matching passwords");
        }
    },

    sign_in: function sign_in(request, response) {
        var email = request.body.email_login;
        var password = request.body.password_login;
        const login_query = "SELECT * FROM vacation_attendee WHERE email = lower('" + email + "')";
        console.log(login_query);
        pool.query(login_query, function (error, result) {
            if (error) {
                console.log("error with login query ---> " + error);
                response.render('the_vacation.ejs', { vacations: undefined, current_user: undefined });
                throw error;
            } else {
                if (result) {
                    console.log("result exist");
                    if (result.rows) { 
                        if(result.rows.length == 0) {
                            console.log("rows is empty");
                            response.render('the_vacation.ejs', { vacations: undefined, current_user: undefined });
                        }
                    }
                }
                if (result.rows.length == 1) {
                    bcrypt.compare(password, result.rows[0].password_hash, function (error, verified) {
                        if (error || !verified) {
                            console.log("error with hash comparison or " + error);
                            response.render('the_vacation.ejs', { vacations: undefined, current_user: undefined });
                        } else {
                            var new_current_user = new attendee.VacationAttendee(result.rows[0].full_name, result.rows[0].email,
                                result.rows[0].password, result.rows[0].id);
                            console.log(new_current_user);
                            get_all_vacations(function (error, vacations) {
                                if (error) {
                                    console.log("error when getting vacations " + error);
                                    response.render('the_vacation.ejs', { vacations: undefined, current_user: undefined });
                                } else {
                                    request.session.current_user = new_current_user;
                                    request.session.vacations = vacations;
                                    response.render('the_vacation.ejs', { vacations: vacations, current_user: new_current_user });
                                }
                            });
                        }
                    });
                }
            }
        });
    },

    //     id | destination |            description             | attendee_creator_id 
    // ----+-------------+------------------------------------+---------------------
    //   1 | Cancun      | Go to all inclussive Xcaret hotel  |                   0
    //   2 | Huaatulco   | Go to all inclussive Barcelo hotel |                   1
    //   3 | China       | Go to the great wall of china      |                   4
    //   4 | China       | Go to the great wall of china      |                   5

    add_vacation: function add_vacation(request, response) {
        var vac_description = request.body.description;
        var vac_destination = request.body.destination;
        const insert_vac_query = "INSERT INTO vacation (destination, description, attendee_creator_id) VALUES ('" + vac_destination +
            "', '" + vac_description +
            "', " + request.session.current_user.id + ") RETURNING id";
        pool.query(insert_vac_query, function (error, result) {
            if (error) {
                console.log("error with inserting vacation query " + error);
                return;
            }
            get_all_vacations(function(error, vacations){
                if (error) { throw errro };
                request.session.vacations = [];
                request.session.vacations = vacations;
                response.render('the_vacation.ejs', { vacations: request.session.vacations, current_user: request.session.current_user });
            });

        });
    },

    add_vote: function add_vote(request, response) {
        var vac_id = request.body.vacation_id;
        var user_id = request.session.current_user.id;
        console.log("vac id =" + vac_id);
        console.log("user id =" + user_id);

        const insert_vote_query = "INSERT INTO vacation_vote (vacation_id, vacation_attende_id) VALUES (" + vac_id + "," + user_id + ")"
        console.log(insert_vote_query);
        pool.query(insert_vote_query, function (error){
            if (error) 
            {
                console.log("error inserting new vote " + error); 
                response.json({success : false });
                return;
            }
            response.json({ success: true });
        });
    }
}