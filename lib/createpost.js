$(document).ready(function() {
    $("#newSubmit").click(function(event) {
        console.log("SUBMIT");
        var newPostObj = {
            title       : $("#newTitle").val(),
            content     : $("#newContent").val(),
            author      : "restful pesto",
            date        : undefined
        }

        $.ajax({
            type: "POST",
            url : "http://localhost:4001/submitnewblogpost",
            data: newPostObj
        });
    })
})