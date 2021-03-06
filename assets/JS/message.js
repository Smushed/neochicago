$(document).ready(function () {
    $('#erMsg').keypress(function (e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            submitMsg();
            return;
        };
    });

    $('#submitMessage').click(function () {
        submitMsg();
    });

    submitMsg = () => {
        if ($('#erMsg').val().trim() === '') {
            return false;
        };

        const msg = {
            message: $('#erMsg').val().trim(),
            ERUN: $('#ERUN').val(),
            CHUN: $('#CHUN').val()
        };

        $.ajax('/message', {
            type: 'POST',
            data: msg,
            statusCode: {
                200: function () {
                    console.log('what the hell')
                    location.reload();
                    console.log('success');
                },
                400: function (err) {
                    alert('Error, tell Kevin this ' + err)
                    console.log('Err ' + err)
                }
            }
        });
    };

    updateScroll = () => {
        var element = document.getElementById('messageLog');
        element.scrollTop = element.scrollHeight;
    };

    updateScroll();
});