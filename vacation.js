var attendee = require('./vacation_attendee')
var vote = require('./vacation_vote')

module.exports = {
    Vacation : class Vacation {
        constructor(id, destination, description, attendee_creator_id) {
            this.id = id;
            this.destination = destination;
            this.description = description;
            this.attendee_creator_id = attendee_creator_id;
            this.creator = undefined;
            this.votes = [];
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
        find_votes(pool){
            var self = this;
            return new Promise(function (resolve, reject) {
            var query = "SELECT * FROM vacation_vote WHERE vacation_id = " + self.id;
            pool.query(query, function(error, result) {
                if (error) {
                    console.log("Error in query for vacation creator " + error);
                    return reject(error);
                }
            var votes = [];
            for (var vote_at_index in result.rows) {
                votes.push(new vote.VacationVote(vote_at_index.id, vote_at_index.vacation_id, vote_at_index.vacation_attende_id));
            }
            self.votes = votes;
            resolve(self);
            });
        })
        }
    }
}