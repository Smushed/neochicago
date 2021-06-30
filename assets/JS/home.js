$(document).ready(function () {
    $('#erIdInput').keypress(function (e) {
        if (e.keyCode === 13) {
            goToId();
        };
    });

    $('#submitId').click(function () {
        goToId();
    });

    goToId = () => {
        const erId = $('#erIdInput').val().trim();
        window.location.replace(`er/${erId}`)
    };
});