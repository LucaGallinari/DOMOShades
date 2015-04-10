/**
 * Created by BrosDs on 09/04/2015.
 * This Js is for create a responsive Floating Action Button on the floor creation page.
 *
 */

var fab = $('#fancy-fab');
var fabC = $('.fab-container');
var contentAdd = "mdi-content-add";
var contentSave = "mdi-content-save";
var contentRoom = "mdi-maps-layers";
var contentWindow = "mdi-image-crop-portrait";
var duration = 200;

var selectionNumber = 1;

var oldIcon = contentAdd;
var newIcon = contentSave;

/** Over and Back custom creators */
$(function(){
    fabC.hover(function(){
        hoverFAB(oldIcon, newIcon);
    }, function(){
        defaultFAB(newIcon, oldIcon);
    });
});


function hoverFAB(removeFab, showFab){
    var icon = fab.find("."+removeFab);

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

function defaultFAB(removeFab, showFab){
    var icon = fab.find(".mdi-content-save").first();

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

    switch(selectionNumber){
        case 1:
            if(mouseOver){
                $({deg: 0}).animate(
                    {deg: 360},
                    {
                        duration: duration,
                        queue: false,
                        step: function(now){rotate(icon, now)},
                        complete: showFirstSelector()
                    }
                )
            }
            else{
                $({deg: 0}).animate(
                    {deg: 360},
                    {
                        duration: duration,
                        queue: false,
                        step: function(now){rotate(icon, now)},
                        complete: hideFirstSelector()
                    }
                )
            }
            break;
        case 2:
        case 3:
            if(mouseOver){
                $({deg: 0}).animate(
                    {deg: 360},
                    {
                        duration: duration,
                        queue: false,
                        step: function(now){rotate(icon, now)},
                        complete: showSelector()
                    }
                )
            }
            else{
                $({deg: 0}).animate(
                    {deg: 360},
                    {
                        duration: duration,
                        queue: false,
                        step: function(now){rotate(icon, now)},
                        complete: hideSelector()
                    }
                )
            }
            break;
    }
}

function rotate(icon, now){
    icon.css({
        transform: "rotate(" + now + "deg)"
    });
}

function showFirstSelector(){
    var room="<div id='room-fab' class='center hidden' style='margin-bottom: 5px'><a href='javascript:roomActions()' class='new-room btn-floating btn-medium waves-effect waves-light yellow darken-2 tooltipped' data-position='left' data-delay='0' data-tooltip='New Room' ><i class='mdi-maps-layers'></i></a></div>";
    var window="<div id='window-fab' class='center hidden' style='margin-bottom: 5px'><a href='javascript:windowActions()' class='new-window btn-floating btn-medium waves-effect waves-light blue lighten-3 tooltipped' data-position='left' data-delay='0' data-tooltip='New Window' ><i class='mdi-image-crop-portrait'></i></a></div>";

    fab.before(window, room);

    $('.tooltipped').tooltip();

    roomFAB = $('#room-fab');
    windowFAB = $('#window-fab');

    roomFAB.show(duration, function(){
        windowFAB.show(duration)
    });
}

function hideFirstSelector(){
    roomFAB = $('#room-fab');
    windowFAB = $('#window-fab');

    windowFAB.hide(duration, function(){
        roomFAB.hide(duration)
    });

    roomFAB.remove();
    windowFAB.remove();
}

function showSelector(){
    var undo="<div id='undo-fab' class='center hidden' style='margin-bottom: 5px'><a href='javascript:undoFab()' class='btn-floating btn-medium waves-effect waves-light purple lighten-1 tooltipped' data-position='left' data-delay='0' data-tooltip='Undo' ><i class='mdi-content-undo'></i></a></div>";
    var remove="<div id='remove-fab' class='center hidden' style='margin-bottom: 5px'><a href='javascript:removeFab()' class='btn-floating btn-medium waves-effect waves-light deep-orange lighten-1 tooltipped' data-position='left' data-delay='0' data-tooltip='Remove' ><i class='mdi-navigation-close'></i></a></div>";
    var back = "<div id='back-fab' class='center hidden' style='margin-bottom: 5px'><a href='javascript:back()' class='btn-floating btn-medium waves-effect waves-light indigo lighten-1 tooltipped' data-position='left' data-delay='0' data-tooltip='Back' ><i class='mdi-navigation-arrow-back'></i></a></div>"

    fab.before(back, undo, remove);

    $('.tooltipped').tooltip();

    undoFAB = $('#undo-fab');
    removeFAB = $('#remove-fab');
    backFAB = $('#back-fab');

    removeFAB.show(duration, function(){
        undoFAB.show(duration, function(){
            backFAB.show(duration);
        })
    });
}

function hideSelector(){

    undoFAB = $('#undo-fab');
    removeFAB = $('#remove-fab');
    backFAB = $('#back-fab');

    backFAB.hide(duration, function(){
        undoFAB.hide(duration, function(){
            removeFAB.hide(duration);
        })
    });

    undoFAB.remove();
    removeFAB.remove();
    backFAB.remove();
}

function roomActions(){
    defaultFAB(contentSave,contentRoom);
    oldIcon = contentRoom;
    newIcon = contentSave;

    fab.removeClass('red').addClass('yellow darken-2');
    selectionNumber = 2;

    //TODO
    fab.attr('href', 'javascript:saveRoom()');
    fab.attr('data-tooltip','Save Room');

    changeMode(1);
}

function windowActions(){
    defaultFAB(contentSave,contentWindow);
    oldIcon = contentWindow;
    newIcon = contentWindow;

    fab.removeClass('red').addClass('blue lighten-3');
    selectionNumber = 3;

    //TODO
    fab.attr('href', '');
    fab.attr('data-tooltip','Window');

    changeMode(5);
}

function back(){
    defaultFAB(contentSave,contentAdd);
    oldIcon = contentAdd;
    newIcon = contentSave;

    fab.removeClass('yellow blue lighten-3 darken-2').addClass('red');
    selectionNumber = 1;

    //TODO
    fab.attr('href', 'javascript:saveCanvas()');
    fab.attr('data-tooltip','Save Floor');
}


function undoFab(){
    switch(selectionNumber) {
        case 2:   if (currentPoly) {
                        currentPoly.removeLastPoint();
                    }
                    canvas.renderAll();
            break;
        case 3:
                //TODO
    }
}

function removeFab(){
    switch(selectionNumber){
        case 2://ROOM
            changeMode(2);
            break;
        case 3://WINDOW
            changeMode(6);
            break;
    }
}

function saveRoom(){
    // TODO
}