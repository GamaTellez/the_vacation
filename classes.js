module.exports = {
    Vacation : class Vacation {
        constructor(destination, description, attendee_creator_id) {
            this.destination = destination;
            this.description = description;
            this.attendee_creator_id = attendee_creator_id;
        }
    },

    VacationAttendee : class VacationAttendee {
        constructor(full_name, email, password) {
            this.full_name = full_name;
            this.email = email;
            this.password = password;
        }

        get_name() {
            return this.full_name;
        }
    },

    Vacation_vote : class Vacation_vote {
        constructor(vacation_id) {
            this.vacation_id = vacation_id;
        }
    }


}