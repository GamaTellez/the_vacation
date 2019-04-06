function user_login(email, password) {
    var data = {};
    data.email_login = email;
    data.password_login = password;
    var message_header = $("#message_header");
    $.ajax({
        url: "/sign_in",
        method: 'POST',
        data: data
    }).done(function (error, response) {
        if (!response.success) {
            message_header.text("Incorrect email of password. Please try again.").css("color", "red");
            $("#username_textfield").val("");
            $("#password_textfield").val("");
        } else {
            alert(error);
        }
    });
}

function add_vote(user_id, vacation_id) {

}