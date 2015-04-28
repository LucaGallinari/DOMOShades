// Initialize collapse button
$('.button-collapse').sideNav();

var close = 0;

function toggleBottomCard(id){
    switch(close){
        case 0: showForm(id);
            break;
        case 1: hideForm(id);
            break;
    }
}

function showForm(id) {
    Materialize.showStaggeredList(id);

    $({deg: 0}).animate(
        {deg: 45},
        {
            duration: 90,
            queue: false,
            step: function(now){rotate($('#add-new-floor:first i'), now)}
        }
    );

    close = 1;
}

function hideForm(id) {
    hideStaggeredList(id);


    $({deg: 45}).animate(
        {deg: 0},
        {
            duration: 90,
            queue: false,
            step: function(now){rotate($('#add-new-floor:first i'), now)}
        }
    );

    close = 0;
}

function hideStaggeredList(selector) {
    var time = 0;
    $(selector).find('li').velocity(
        { translateX: "0px"},
        { duration: 0 });

    $(selector).find('li').each(function() {
        $(this).velocity(
            { opacity: "0", translateX: "-100"},
            { duration: 800, delay: time, easing: [60, 10] });
        time += 120;
    });
}

function rotate(icon, now){
    icon.css({
        transform: "rotate(" + now + "deg)"
    });
}