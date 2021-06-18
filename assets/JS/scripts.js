$(document).ready(function () {
    $('#idInput').submit(function (e) {
        e.preventDefault();
        const erInput = $('#erIdInput').val();
        console.log(erInput)
        $.ajax({
            url: '/api/login',
            type: 'GET',
            data: { id: erInput },
            datatype: 'json',
            success: function (res) {
                console.log(res)
            },
            error: function () {
                window.location.replace('/ACCESS_DENIED')
            }
        })
    })
});