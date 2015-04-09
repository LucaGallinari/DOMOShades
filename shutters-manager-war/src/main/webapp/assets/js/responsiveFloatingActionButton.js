/**
 * Created by BrosDs on 09/04/2015.
 * This Js is for create a responsive Floating Action Button on the floor creation page.
 *
 */

var fab = $('#fancy-fab');
var fabC = $('.fab-container');
var contentAdd = "mdi-content-add";
var contentSave = "mdi-content-save";
var duration = 200;

/** Over and Back custom creators */
$(function(){
    fabC.hover(function(){
        var icon = fab.find(".mdi-content-add").first();
        hoverFAB(icon, contentAdd, contentSave);
    }, function(){
        var icon = fab.find(".mdi-content-save").first();
        defaultFAB(icon, contentSave, contentAdd);
    });
});


function hoverFAB(icon, removeFab, showFab){
    $({deg: 0}).animate(
        {deg: 360},
        {
            duration: duration,
            queue: false,
            step: function(now){rotate(icon, now)},
            start: showOther(icon, removeFab, showFab, true)
        }
    );
}

function defaultFAB(icon, removeFab, showFab){
    $({deg: 360}).animate(
        {deg: 0},
        {
            duration: duration,
            queue: false,
            step: function(now){rotate(icon, now)},
            start: showOther(icon, removeFab,showFab, false)
        }
    );
}

function showOther(icon, removeFab, showFab, mouseOver){
    icon.removeClass(removeFab).addClass(showFab);

    if(mouseOver){
        $({deg: 0}).animate(
            {deg: 360},
            {
                duration: duration,
                queue: false,
                step: function(now){rotate(icon, now)},
                complete: showActions()
            })
    }
    else{
        $({deg: 0}).animate(
            {deg: 360},
            {
                duration: duration,
                queue: false,
                step: function(now){rotate(icon, now)},
                complete: hideActions()
            })
    }
}

function rotate(icon, now){
    icon.css({
        transform: "rotate(" + now + "deg)"
    });
}

function showActions(){
    var room="<div id='room-fab' class='center hidden' style='margin-bottom: 5px'><a class='btn-floating btn-medium waves-effect waves-light blue'><i class='mdi-content-add'></i></a></div>";
    var window="<div id='window-fab' class='center hidden' style='margin-bottom: 5px'><a class='btn-floating btn-medium waves-effect waves-light yellow'><i class='mdi-content-add'></i></a></div>";

    fab.before(window, room);
    $('#room-fab').show(duration, function(){
        $('#window-fab').show(duration)
    });
}

function hideActions(){
    $('#window-fab').hide(duration, function(){
        $('#room-fab').hide(duration)
    });

    $('#room-fab').remove();
    $('#window-fab').remove();
}


