/**
 * Created by kalu on 03/04/15.
 *
 * Library of functions for handling floors management
 * with lots of transitions and some ajax request.
 *
 */
var addFloorForm     = "#addFloorForm";
var modifyFloorForm  = "#modifyFloorForm";
var listFloors       = "#listFloors";
var typef            = "#typef";

var close = 0;

$(document).ready(function(){

    /* - ADD FLOOR - */
    $(addFloorForm).on('submit', function() {
        // pre ajax request
        var buttonsRow = $(addFloorForm).find('.buttons-row').first();
        buttonsRow.find('button').hide();
        buttonsRow.append(preloader_wrapper('right'));
        // get first available floor id
        var floorId = getAvailableFloorID();

        // do an ajax req
        $.ajax({
            type: "POST",
            url: "/floors/add?id="+floorId,
            data: $(this).serialize() // serializes the form's elements.
        })
        .done(function( data ) {
            //$('#addModal').closeModal();

            data = data.toString();
            // rollback
            buttonsRow.find('.preloader-wrapper').remove();
            buttonsRow.find('button').show();
            hideBottomCard();

            if (data.indexOf("Ok")!=-1) { // if everything's ok
                Materialize.toast('Floor added!', 3000, 'rounded');
                data.substr(4, data.length-4);
                addListElement(floorId);
                updateTypesList();
                $(addFloorForm).trigger("reset");
                // hide errors
                if ($('.removeFloor').length==1) {
                    $(listFloors).show();
                    $('#noFloors').hide(500);
                }
            } else { // display error
                Materialize.toast('Ops! An error occured.', 3000, 'rounded');
                $('#addFloorErrors').html(data).fadeIn();
            }
        });

        return false; // avoid to execute the actual submit of the form.
    });


    /* - REMOVE FLOOR - */
    $(listFloors).on('click', 'a.removeFloor', function() {
        // pre ajax request
        var id = $(this).attr('data-toggle');
        $('#agreeRemove').attr('data-toggle', id);
        $('#confirmModal').openModal();
    });

    $('.modal-footer').on('click', '#agreeRemove', function() {
        var id = $(this).attr('data-toggle');
        var parentId = "#removeFloor" + id;
        $(parentId).find('.removeFloor').hide();
        $(parentId).append(preloader_wrapper('center'));
        var homeId = $(addFloorForm).find('input[name="home"]').first().val();
        // do an ajax req
        $.ajax({
            url: '/floors/remove?home='+homeId+'&floor='+id
        })
        .done(function( data ) {
            data = data.toString();
            if (data=="Ok") { // if everything's ok
                Materialize.toast('Floor removed!', 3000, 'rounded');
                remFloorElement(id);
                updateTypesList();
                $('#listFloor'+id).hide(500, function(){
                    // some animations
                    $(this).remove();
                    if ($('.removeFloor').length==0) {
                        $(listFloors).hide();
                        $('#noFloors').show(500);
                    }
                });

            } else { // error
                // rollback
                $(parentId).find('.removeFloor').show();
                $(parentId).find('.preloader-wrapper').remove();
                // display error
                Materialize.toast('Ops! An error occured.', 3000, 'rounded');
                $(parentId).html(data);
            }
        });
    });


    /* - MODIFY FLOOR -
    // set up
    $(addFloorForm).clone() // copy form for modifying
        .attr('id','modifyFloorForm') // modify id
        .appendTo('#modifyFloorContainer'); // append to modal
    $(modifyFloorForm).find('input').each(function(){ //change ids
        $(this).attr('id',$(this).attr('id')+'Modify')
    });
    $(modifyFloorForm).find('label').each(function(){ // change fors
        $(this).attr('for',$(this).attr('for')+'Modify')
    });

	$(modifyFloorForm).find('button').attr('class', 'btn-floating btn-flat btn-large waves-effect waves-light light-blue right'); // modify button
    $(modifyFloorForm).find('button i').attr('class', 'mdi-navigation-check'); // modify button

    $(modifyFloorForm).find('button i').attr('class', 'mdi-action-done'); // modify button
    // add close modal button
    $(modifyFloorForm).find('.buttons-row').append(
        '<button class="btn-floating btn-large btn-flat waves-effect waves-light modal-close left grey lighten-3"> ' +
            '<i class="mdi-content-clear grey-text"></i>' +
        '</button>'
    );

    // events
    $(listFloors).on('click', 'a.modifyFloor', function() {
        // pre ajax request
        var id = $(this).attr('data-toggle');
        //$(this).hide();
        setupModifyForm(id);
        $('#modifyModal').openModal();
        $('#modifyFloorErrors').hide();
    });

    $(modifyFloorForm).on('submit', function() {
        // pre ajax request
        var buttonsRow = $(this).find('.buttons-row').first();
        var id = buttonsRow.find('button').attr('data-toggle');
        $('#modifyFloorErrors').hide();
        buttonsRow.find('button').hide();
        buttonsRow.append(preloader_wrapper('right'));
        // do an ajax req
        $.ajax({
            type: "POST",
            url: '/floor/modify?id='+id,
            data: $(this).serialize() // serializes the form's elements.
        })
        .done(function(data) {
            data = data.toString();
            //$('#modifyFloorErrors').html(data);
            buttonsRow.find('.preloader-wrapper').remove();
            buttonsRow.find('button').show();
            if (data.toString()=="Ok") { // if everything's ok
                Materialize.toast('Floor modified!', 3000, 'rounded');
                modifyListElement(id);
                $('#modifyModal').closeModal();
            } else { // if not display error
                Materialize.toast('Ops! An error occured.', 3000, 'rounded');
                $('#modifyFloorErrors').html(data).fadeIn().delay(3000).fadeOut();
            }
        });
        return false; // avoid to execute the actual submit of the form.
    });*/

});

function toggleBottomCard(){
    switch(close){
        case 0: showBottomCard();
            break;
        case 1: hideBottomCard();
            break;
    }
}

function showBottomCard() {
    Materialize.showStaggeredList('#new-floor');

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

function hideBottomCard() {
    hideStaggeredList('#new-floor');


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

function rotate(icon, now){
    icon.css({
        transform: "rotate(" + now + "deg)"
    });
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
};

function updateTypesList() {
    $(typef).empty();
    for (var i = 0; i < floorTypes.length; i++) {
        var typeId = floorTypes[i].id;
        var found=false;
        for (var k = 0; (k < floors.length) && !found; k++) {
            if (floors[k].type == typeId) {
                found=true;
            }
        }
        if (!found) {
            $(typef).append('<option value="'+typeId+'">'+floorTypes[i].str+'</option>');
        }
    }
    $('select').material_select();
}

function getAvailableFloorID() {
    var id=0;
    for (var i = 0; i < floors.length; i++) {
        if (floors[i].id>id) {id=floors[i].id}
    }
    return id+1;
}

function addFloorElement(idFloor, type, idHome) {
    var f = {
        "id":idFloor,
        "house":{"key":{"raw":{"id":idHome}}},
        "type":type
    };//TODO: add complete data references
    floors.push(f);
}

function remFloorElement(idFloor) {
    for (var i = 0; i < floors.length; i++) {
        if(floors[i].id==idFloor) {
            floors.splice(i, 1);
            return;
        }
    }
}

function modifyListElement(id) {
    $(modifyFloorForm).find('input').each(function(){ // for each input fill the respective td
        $('#listFloor'+id) // get the tr
            .find('.'+$(this).attr('name')) // get the respective "td"
            .html($(this).val());// set the value of that element
    });
}

function setupModifyForm(id) {
    $(modifyFloorForm).find('input').each(function(){ // fill each input with respective value
        $(this).val(
            $('#listFloor'+id) // get the tr
                .find('.'+$(this).attr('name')) // get the respective "td"
                .html() // get the value of that element
        )
        .focusin()
    });
    $(modifyFloorForm).find('button').attr('data-toggle', id);
}

function addListElement(id) {
    // get values
    var type = parseInt($(typef).val());
    var homeId = $(addFloorForm).find('input[name="home"]').first().val();

    // add floor to list
    addFloorElement(id,type,homeId);

    // add element
    var el = $(list_element(id,type,homeId));
    el.hide();
    //$(listFloors).find('tbody').append(el)4;
    $(listFloors).append(el);
    $('.tooltipped').tooltip({delay: 0});
    el.fadeIn();
}



function list_element(id, type, homeId) {
/*
    return ' \
        <tr id="listFloor'+(id)+'" class="new"> \
            <td class="type">'+floorTypes[type].str+'</td> \
            <td> \
                <a data-toggle="'+(id)+'" class="small waves-effect waves-green btn-flat modifyFloor tooltipped" data-position="bottom" data-delay="50" data-tooltip="Modify Floor Values"> \
                    <i class="mdi-content-create green-text"></i> \
                </a> \
                <a data-toggle="'+(id)+'" class="small waves-effect waves-red btn-flat removeFloor tooltipped" data-position="bottom" data-delay="50" data-tooltip="Delete Floor"> \
                    <i class="mdi-content-clear red-text"></i> \
                </a> \
                <a href="/floor/manage?home='+(homeId)+'&floor='+(id)+'" class="small waves-effect waves-blue btn-flat manageFloor tooltipped" data-position="bottom" data-delay="50" data-tooltip="Manage Floor"> \
                    <i class="mdi-content-forward blue-text"></i> \
                </a> \
                <a href="/rules/?home='+(homeId)+'&floor='+(id)+'" class="small waves-effect waves-blue btn-flat manageFloor tooltipped" data-position="bottom" data-delay="50" data-tooltip="Manage Rules"> \
                    <i class="mdi-content-content-paste orange-text"></i> \
                </a> \
            </td> \
        </tr>';
*/
    return '    \
        <li id="listFloor'+(id)+'" class="collection-item new">' +
            '<span>' + floorTypes[type].str +'</span>'+
            '<a href="/rules/?home='+(homeId)+'&floor='+(id)+'"    \
                class="tiny waves-effect waves-orange manageRules tooltipped right" \
                data-position="bottom" data-tooltip="Manage Rules"> \
                    <i class="mdi-content-content-paste orange-text"></i> \
            </a> \
            <a href="/floor/manage?home='+(homeId)+'&floor='+(id)+'"    \
                class="tiny waves-effect waves-blue manageFloor tooltipped right" \
                data-position="bottom" data-tooltip="Manage Floor"> \
                    <i class="mdi-content-forward blue-text"></i> \
            </a> \
            <a data-toggle="'+(id)+'" \
                class="tiny waves-effect waves-red removeFloor tooltipped right" \
                data-position="bottom" data-tooltip="Delete Floor"> \
                    <i class="mdi-content-clear red-text"></i> \
            </a> \
            <a data-toggle="'+(id)+'" \
                class="tiny waves-effect waves-green modifyFloor tooltipped right" \
                data-position="bottom" data-tooltip="Modify Floor Values"> \
                    <i class="mdi-content-create green-text"></i> \
            </a> \
        </li>';
}

function preloader_wrapper(pos) {
    return ' \
        <div class="preloader-wrapper small active '+pos+'"> \
            <div class="spinner-layer spinner-green-only"> \
                <div class="circle-clipper left"> \
                <div class="circle"></div> \
                </div><div class="gap-patch"> \
                <div class="circle"></div> \
                </div><div class="circle-clipper right"> \
                <div class="circle"></div> \
                </div> \
            </div> \
        </div>';
}
