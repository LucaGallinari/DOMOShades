/**
 * Created by kalu on 06/04/15. TODO: REMOVE THIS FILE
 *
 * Library of functions for handling floors management
 * with lots of transitions and some ajax request.
 *
 */
var addFloor        = "#addFloor";
var addFloorCanvas  = "#addFloorCanvas";
var ultabs          = "ul.tabs";
var listFloors      = "#listFloors";

$(document).ready(function(){
    /* - ADD FLOOR - */
    $(ultabs).on('click', addFloor, function() {
        var floorId = $(listFloors).find('li').length;
        if (floorId >=0 && floorId <=5) {
            // clone list element
            $(this).clone().hide().insertAfter(this).fadeIn();
            $(this)
                .removeAttr('id')
                .find('a').attr('href', '#floor'+floorId).html('Floor '+floorId);
            // clone canvas
            $(addFloorCanvas).clone().hide().insertAfter(addFloorCanvas).fadeIn();
            $(addFloorCanvas).attr('id', 'floor'+floorId).html('Canvas floor '+floorId);
            $(ultabs).find('div.indicator').remove();
            // redo materializecss tabs
            $(ultabs).tabs();
        } else if(floorId == 6) {
            // set list element
            $(this)
                .removeAttr('id')
                .find('a').attr('href', '#floor'+floorId).html('Floor '+floorId);
            // set canvas
            $(addFloorCanvas).attr('id', 'floor'+floorId).html('Canvas floor '+floorId);
            $(ultabs).find('div.indicator').remove();
            // redo materializecss tabs
            $(ultabs).tabs();
        } else {
            Materialize.toast('A home can have up to 6 floors!', 3000, 'rounded');
        }
    });

});