module.exports = {
    vacation : class Vacation {
        constructor(destination) {
            this.destination = destination;
        }
    },

    vacation_goer : class VacationGoer {
        constructor(name) {
            this.name = name;
        }
    },

    vacation_vote : class Vacation_vote {
        constructor(vacation_id) {
            this.vacation_id = vacation_id;
        }
    }
}