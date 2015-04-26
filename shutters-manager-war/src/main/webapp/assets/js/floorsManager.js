/**
 * Created by kalu on 03/04/15.
 *
 * Library of functions for handling floors management
 * with lots of transitions and some ajax request.
 *
 */
var addFloorForm     = "#addFloorForm";
var listFloors       = "#listFloors";

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
                updateTypesList('#typef');
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
                updateTypesList('#typef');
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
}

function updateTypesList(typef) {
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
    $(typef).material_select();
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
    };
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

function addListElement(id) {
    // get values
    var type = parseInt($(typef).val());
    var homeId = $(addFloorForm).find('input[name="home"]').first().val();

    // add floor to list
    addFloorElement(id,type,homeId);

    // add element
    var el = $(list_element(id,type,homeId));
    el.hide();
    $(listFloors).find('tbody').append(el);
    //$(listFloors).append(el);
    $('.dropdown-button').dropdown();
    el.fadeIn();
}



function list_element(id, type, homeId) {
    return '    \
        <tr id="listFloor'+(id)+'" class="collection-item new"> \
            <td class="floorName" data-value="'+type+'"> \
                <span>'+ floorTypes[type].str +'</span> \
            </td> \
            <td class="floorAction">   \
                <a class="dropdown-button right grey-text" href="#" data-activates="dropdown'+(id)+'"><i class="mdi-navigation-more-vert grey-text"></i></a>\
                <ul id="dropdown'+(id)+'" class="dropdown-content">\
                    <li><a href="/floor/manage?home='+(homeId)+'&floor='+(id)+'" class="manageFloor black-text"> Manage </a></li>\
                    <li><a data-toggle="'+(id)+'" class="removeFloor black-text">Remove</a></li>\
                    <li><a href="/rules/?home='+(homeId)+'&floor='+(id)+'" class="manageRules black-text">Rules </a></li>\
                </ul>\
            </td> \
        </tr>';
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
