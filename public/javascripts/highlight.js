$('.noth').hover(
    function (event) {
        var elem = document.elementFromPoint(event.clientX, event.clientY);
        $(elem).addClass('highlight');
    },
    function (event) {
        $('.highlight').removeClass('highlight');

    }
);