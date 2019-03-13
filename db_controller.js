module.exports = {
    get_vacations: function get_vacations(request, response) {
        
        var params = {message:"it is working"};
        response.render('the_vacation.ejs', params);
    }   
}