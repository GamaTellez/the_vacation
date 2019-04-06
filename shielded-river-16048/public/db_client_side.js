function user_login(email, password) {
    var message_header = $("#message_header");
    $.ajax({
        url:"/sign_in", 
        data: { email_login:email, password_login:password}
    }) .done(function(data) {
        if (!data.logged_in) {
            message_header.text("Incorrect email of password. Please try again.").css("color","red");
            $("#username_textfield").val("");
            $("#password_textfield").val("");
        }
    });
}

function add_vote(user_id, vacation_id) {
    
}