module.exports = {

    VacationAttendee : class VacationAttendee {
        
        constructor(full_name, email, password) {
            this.full_name = full_name;
            this.email = email;
            this.password = password;
        }

        get_name() {
            return this.full_name;
        }
    }
}