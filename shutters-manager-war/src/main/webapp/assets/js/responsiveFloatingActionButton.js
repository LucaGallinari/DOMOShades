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

var selectionNumber = 2;

var oldIcon = contentRoom;
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
    var icon = fab.find("."+removeFab).first();

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

    /*
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
    */
}

function rotate(icon, now){
    icon.css({
        transform: "rotate(" + now + "deg)"
    });
}

/*
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

*/
function showSelector(){
    var undo="<div id='undo-fab' class='center hidden' style='margin-bottom: 5px'><a href='javascript:undoFab()' class='btn-floating btn-medium waves-effect waves-light purple lighten-1 tooltipped' data-position='left' data-delay='0' data-tooltip='Undo' ><i class='mdi-content-undo'></i></a></div>";
    var remove="<div id='remove-fab' class='center hidden' style='margin-bottom: 5px'><a href='javascript:removeFab()' class='btn-floating btn-medium waves-effect waves-light deep-orange lighten-1 tooltipped' data-position='left' data-delay='0' data-tooltip='Remove' ><i class='mdi-navigation-close'></i></a></div>";
    //var back = "<div id='back-fab' class='center hidden' style='margin-bottom: 5px'><a href='javascript:back()' class='btn-floating btn-medium waves-effect waves-light indigo lighten-1 tooltipped' data-position='left' data-delay='0' data-tooltip='Back' ><i class='mdi-navigation-arrow-back'></i></a></div>"

    var toggle;

    switch(selectionNumber){
        case 2: //Room -> Window button
            //            toggle="<div id='toggle-fab' class='center hidden' style='margin-right: -100px; margin-top: -45px;'><a href='javascript:windowActions()' class='new-window btn-floating btn-medium waves-effect waves-light blue lighten-3 tooltipped' data-position='bottom' data-delay='0' data-tooltip='Window Men&ugrave;' ><i class='mdi-image-crop-portrait'></i></a></div>";
            toggle = "<a id='toggle-fab' style='margin-right: -37px; margin-left: 5px' href='javascript:windowActions()' class='center hidden new-window btn-floating btn-medium waves-effect waves-light blue lighten-3 tooltipped' data-position='bottom' data-delay='0' data-tooltip='Window Men&ugrave;' ><i class='mdi-image-crop-portrait'></i></a>";
            break;
        case 3: //Window -> Room button
            //             toggle="<div id='toggle-fab' class='center hidden' style='margin-right: -100px; margin-top: -45px;'><a href='javascript:roomActions()' class='new-room btn-floating btn-medium waves-effect waves-light yellow darken-2 tooltipped' data-position='bottom' data-delay='0' data-tooltip='Room Men&ugrave;' ><i class='mdi-maps-layers'></i></a></div>";
            toggle = "<a id='toggle-fab' style='margin-right: -37px; margin-left: 5px' href='javascript:roomActions()' class='center hidden new-room btn-floating btn-medium waves-effect waves-light yellow darken-2 tooltipped' data-position='bottom' data-delay='0' data-tooltip='Room Men&ugrave;' ><i class='mdi-maps-layers'></i></a>";
            break;
    }

    fab.before(undo, remove);
    fab.after(toggle);

    $('.tooltipped').tooltip();

    undoFAB = $('#undo-fab');
    removeFAB = $('#remove-fab');
    //backFAB = $('#back-fab');
    toggleFAB = $('#toggle-fab');

    removeFAB.show(duration, function(){
        undoFAB.show(duration, function(){
            //backFAB.show(duration);
            toggleFAB.show(duration);
        })
    });
}

function hideSelector(){
    undoFAB = $('#undo-fab');
    removeFAB = $('#remove-fab');
    //backFAB = $('#back-fab');
    toggleFAB = $('#toggle-fab');

    toggleFAB.hide(duration, function(){
        undoFAB.hide(duration, function(){
            removeFAB.hide(duration);
        })
    });

    undoFAB.remove();
    removeFAB.remove();
    //backFAB.remove();
    toggleFAB.remove();
}

function roomActions(){
    defaultFAB(contentSave,contentRoom);
    oldIcon = contentRoom;
    newIcon = contentSave;

    fab.removeClass('blue lighten-3').addClass('yellow darken-2');
    selectionNumber = 2;

    //TODO
    //fab.attr('href', 'javascript:saveRoom()');
    //fab.attr('data-tooltip','Save Room');

    changeMode(1);
}

function windowActions(){
    defaultFAB(contentSave,contentWindow);
    oldIcon = contentWindow;
    newIcon = contentSave;

    fab.removeClass('yellow darken-2').addClass('blue lighten-3');
    selectionNumber = 3;

    //TODO
    //fab.attr('href', '');
    //fab.attr('data-tooltip','Save Window');

    changeMode(5);
}

/*
function back(){
    switch(selectionNumber){
        case 2:
            defaultFAB(contentSave,contentAdd);
            break;
        case 3:
            defaultFAB(contentWindow,contentAdd);
            break;
    }

    oldIcon = contentAdd;
    newIcon = contentSave;

    fab.removeClass('yellow blue lighten-3 darken-2').addClass('red');
    selectionNumber = 1;

    fab.attr('href', 'javascript:saveCanvas("#canvasForm")');
    fab.attr('data-tooltip','Save Floor');
}

*/
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