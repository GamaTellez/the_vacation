var attendee = require('./vacation_attendee')
module.exports = {
    Vacation : class Vacation {
        constructor(id, destination, description, attendee_creator_id) {
            this.id = id;
            this.destination = destination;
            this.description = description;
            this.attendee_creator_id = attendee_creator_id;
            this.creator = undefined;
            this.votes = undefined;
        }
        find_creator(pool){
            var self = this;
            return new Promise(function (resolve, reject) {
                var query = "SELECT * FROM vacation_attendee WHERE id = " + self.attendee_creator_id;
                pool.query(query, function(error, result) {
                    if (error) {
                        console.log("Error in query for vacation creator " + error);
                        return reject(error);
                    }
                var creator = new attendee.VacationAttendee(result.rows[0].full_name, result.rows[0].email, result.rows[0].password_hash);
                self.creator = creator;
                resolve(self);
            });
            })
        }
    },

    find_votes(pool){
        var self = this;
        console.log(self.destination + "<-- in find_creator function");
        return new Promise(function (resolve, reject) {
            var query = "SELECT * FROM vacation_vote WHERE id = " + self.attendee_creator_id;
            pool.query(query, function(error, result) {
                if (error) {
                    console.log("Error in query for vacation creator " + error);
                    return reject(error);
                }
            var creator = new attendee.VacationAttendee(result.rows[0].full_name, result.rows[0].email, result.rows[0].password_hash);
            self.creator = creator;
            resolve(self);
        });
        })
    }
}