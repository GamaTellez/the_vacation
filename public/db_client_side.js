function user_login(email, password) {
    var data = {};
    data.email_login = email;
    data.password_login = password;
    var message_header = $("#message_header");
    $.ajax({
        url: "/sign_in",
        method: 'POST',
        data: data
    }).done(function (res) {
        if (!res.success) {
            message_header.text("Incorrect email of password. Please try again.").css("color", "red");
            $("#username_textfield").val("");
            $("#password_textfield").val("");
        } 
        if (res.success) {
            console.log("user logged");
            location.reload();
        }
    });
}

function add_vote(vacation_id) {
    $.ajax({
        url:"/add_vote",
        method:"POST",
        data: { vacation_id : vacation_id }
    }).done(function (response) {
            if (response) {
                if (response.success) {
                    alert("your vote was posted successfully");
                    window.location.reload(true);
                } else {
                    alert("sorry, something went wrong while posting your vote.");
                }
            }
    });
}
    