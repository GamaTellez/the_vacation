module.exports = {

    VacationAttendee : class VacationAttendee {
        
        constructor(full_name, email, password, id) {
            this.full_name = full_name;
            this.email = email;
            this.password = password;
            this.id = id;
        }

        get_name() {
            return this.full_name;
        }
    }
}