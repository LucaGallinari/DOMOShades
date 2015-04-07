/**
 * Created by kalu on 03/04/15.
 *
 * Library of functions for handling homes management
 * with a lost of transitions and some ajax request.
 *
 */
var addHomeForm     = "#addHomeForm";
var modifyHomeForm  = "#modifyHomeForm";
var listHomes       = "#listHomes";

$(document).ready(function(){
    /* - ADD HOME - */
    $(addHomeForm).on('submit', function() {
        // pre ajax request
        var buttonsRow = $(addHomeForm).find('.buttons-row').first();
        buttonsRow.find('button').hide();
        buttonsRow.append(preloader_wrapper());

        // do an ajax req
        $.ajax({
            type: "POST",
            url: "/home/add",
            data: $(this).serialize() // serializes the form's elements.
        })
        .done(function( data ) {
            data = data.toString();
            // rollback
            buttonsRow.find('.preloader-wrapper').remove();
            buttonsRow.find('button').show();
            if (data.indexOf("Ok")!=-1) { // if everything's ok
                toast('Home added!', 3000, 'rounded');
                var id = data.substr(4, data.length-4);
                addListElement(id);
                $(addHomeForm).trigger("reset");
                // hide errors
                if ($('.removeHome').length==1) {
                    $(listHomes).show();
                    $('#noHomes').hide(500);
                }
            } else { // display error
                toast('Ops! An error occured.', 3000, 'rounded');
                $('#addHomeErrors').html(data).fadeIn();
            }
        });
        return false; // avoid to execute the actual submit of the form.
    });


    /* - REMOVE HOME - */
    $(listHomes).on('click', 'a.removeHome', function() {
        // pre ajax request
        var id = $(this).attr('data-toggle');
        $('#agreeRemove').attr('data-toggle', id);
        $('#confirmModal').openModal();
    });

    $('.modal-footer').on('click', '#agreeRemove', function() {
        var id = $(this).attr('data-toggle');
        var parentId = "#removeHome" + id;
        console.log(1);
        $(parentId).find('.removeHome').hide();
        $(parentId).append(preloader_wrapper());
        // do an ajax req
        $.ajax({
            url: '/home/remove?id='+id
        })
        .done(function( data ) {
            console.log(2);
            data = data.toString();
            if (data=="Ok") { // if everything's ok
                toast('Home removed!', 3000, 'rounded');
                $('#listHome'+id).hide(500, function(){
                    // some animations
                    $(this).remove();
                    if ($('.removeHome').length==0) {
                        $(listHomes).hide();
                        $('#noHomes').show(500);
                    }
                });

            } else { // rror
                // rollback
                $(parentId).find('.removeHome').show();
                $(parentId).find('.preloader-wrapper').remove();
                // display error
                toast('Ops! An error occured.', 3000, 'rounded');
                $(parentId).html(data);
            }
        });
    });


    /* - MODIFY HOME - */
    // set up
    $(addHomeForm).clone() // copy form for modifying
        .attr('id','modifyHomeForm') // modify id
        .appendTo('#modifyHomeContainer'); // append to modal
    $(modifyHomeForm).find('input').each(function(){ //change ids
        $(this).attr('id',$(this).attr('id')+'Modify')
    });
    $(modifyHomeForm).find('label').each(function(){ // change fors
        $(this).attr('for',$(this).attr('for')+'Modify')
    });

    $(modifyHomeForm).find('button').attr('class', 'btn-floating btn-flat btn-large waves-effect waves-light light-blue right'); // modify button
    $(modifyHomeForm).find('button i').attr('class', 'mdi-navigation-check'); // modify button

    // events
    $(listHomes).on('click', 'a.modifyHome', function() {
        // pre ajax request
        var id = $(this).attr('data-toggle');
        //$(this).hide();
        setupModifyForm(id);
        $('#modifyModal').openModal();
        $('#modifyHomeErrors').hide();
    });

    $(modifyHomeForm).on('submit', function() {
        // pre ajax request
        var buttonsRow = $(this).find('.buttons-row').first();
        var id = buttonsRow.find('button').attr('data-toggle');
        buttonsRow.find('button').hide();
        buttonsRow.append(preloader_wrapper());
        // do an ajax req
        $.ajax({
            type: "POST",
            url: '/home/modify?id='+id,
            data: $(this).serialize() // serializes the form's elements.
        })
        .done(function(data) {
            data = data.toString();
            //$('#modifyHomeErrors').html(data);
            buttonsRow.find('.preloader-wrapper').remove();
            buttonsRow.find('button').show();
            if (data.toString()=="Ok") { // if everything's ok
                toast('Home modified!', 3000, 'rounded');
                modifyListElement(id);
                /* TODO: Close modal */
            } else { // if not display error
                toast('Ops! An error occured.', 3000, 'rounded');
                $('#modifyHomeErrors').html(data).fadeIn();
                /* TODO: Close errors after some seconds */
            }
        });
        return false; // avoid to execute the actual submit of the form.
    })

});

function modifyListElement(id) {
    $(modifyHomeForm).find('input').each(function(){ // for each input fill the respective td
        $('#listHome'+id) // get the tr
            .find('.'+$(this).attr('name')) // get the respective "td"
            .html($(this).val());// set the value of that element
    });
}

function setupModifyForm(id) {
    $(modifyHomeForm).find('input').each(function(){ // fill each input with respective value
        $(this).val(
            $('#listHome'+id) // get the tr
                .find('.'+$(this).attr('name')) // get the respective "td"
                .html() // get the value of that element
        )
        .focusin()
    });
    $(modifyHomeForm).find('button').attr('data-toggle', id);
}

function addListElement(id) {
    // get values
    var descr = $(addHomeForm).find('input[name="description"]').first().val();
    var addr = $(addHomeForm).find('input[name="address"]').first().val();
    var city = $(addHomeForm).find('input[name="city"]').first().val();
    var country = $(addHomeForm).find('input[name="country"]').first().val();
    var cap = $(addHomeForm).find('input[name="cap"]').first().val();

    // add element
    var el = $(list_element(id, descr, addr, city, country, cap));
    el.hide();
    $(listHomes).find('tbody').append(el);
    el.fadeIn();
}

function list_element(id, descr, addr, city, country, cap) {
    return ' \
        <tr id="listHome'+(id)+'" class="new"> \
            <td class="description">'+descr+'</td> \
            <td class="address">'+addr+'</td> \
            <td class="hidden-tc-sm city">'+city+'</td> \
            <td class="hidden-tc-m country">'+country+'</td> \
            <td class="cap hidden">'+cap+'</td> \
            <td id="modifyHome'+(id)+'"> \
                <a data-toggle="'+(id)+'" class="medium waves-effect waves-green btn-flat modifyHome"> \
                    <i class="mdi-editor-mode-edit green-text"></i> \
                </a> \
            </td> \
            <td id="removeHome'+(id)+'"> \
                <a data-toggle="'+(id)+'" class="medium waves-effect waves-red btn-flat removeHome"> \
                <i class="mdi-action-highlight-remove red-text"></i> \
            </a> \
            </td> \
        </tr>';
}

function preloader_wrapper() {
    return ' \
        <div class="preloader-wrapper small active right"> \
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
