
$(document).ready(function(){
    var sel = '#confirmSpecialModal';
    /* - OPEN / CLOSE SHUTTERS - */
    $('#nav-mobile').on('click', 'li.toggleShut a', function() {
        // pre ajax request
        var homeId = $(this).attr('data-toggle');
        var scope = $(this).attr('data-scope');
        $('#agreeSpecial')
            .attr('data-toggle', homeId)
            .attr('data-scope', scope);
        if (scope=="0" || scope=="1") {
            $(sel).find('span').html(scope=="0" ? "open" : "close");
        } else if (scope=="2") {
            $(sel).find('h4').html("Remove open/close special rule");
            $(sel).find('p').html("You are removing the special high priority rule for this house..");
        }
        $(sel).openModal();
    });

    $('.modal-footer').on('click', '#agreeSpecial', function() {
        var id = $(this).attr('data-toggle');
        var scope = $(this).attr('data-scope');
        // do an ajax req
        $.ajax({
            url: '/homes/special?id='+id+'&scope='+scope
        })
        .done(function( data ) {
            data = data.toString();
            if (data=="Ok") { // if everything's ok
                if (scope=="0" || scope=="1") {
                    Materialize.toast('Home '+(scope=="0" ? "opened" : "closed")+'!', 4000, 'rounded');
                } else if (scope=="2") {
                    Materialize.toast('Open/close rule removed!', 4000, 'rounded');
                }
            } else { // error
                // display error
                Materialize.toast('Ops! An error occured.', 3000, 'rounded');
            }
        });
    });
});
