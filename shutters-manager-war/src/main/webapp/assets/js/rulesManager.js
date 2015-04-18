var floorRules  = 'floorRules';
var roomRules   = 'roomRules';
var windowRules = 'windowRules';
var noFloorRules    = '#noFloorRules';
var noRoomRules     = '#noRoomRules';
var noWindowRules   = '#noWindowRules';

var addRuleForm = '#addRuleForm';

var currEditPoly = null;
var currEditShut = null;

var addRuleButton = jQuery('<button/>', {
    href: '',
    class: 'btn waves-effect waves-light amber right addRule',
    type: 'button',
    html: '<i class="mdi-content-add"></i> Add Rule'
});


/* HELPERS */
function isHomeRule(){
    return val==100;
}
function isFloorRule(val){
    return between(val,77,99);
}
function isRoomRule(val){
    return between(val,33,76);
}
function isWindowRule(val){
    return between(val,1,32);
}
function isDefaultRule(){
    return val==0;
}
function between(x, min, max) {
    return x >= min && x <= max;
}


/* ## FLOOR MANAGERS ## */

function editFloor(){
    if (currEditPoly!=null) {
        changeShuttersFillColor(currEditPoly, -1, false);
        polys[currEditPoly].changeFillColor(false);
        currEditPoly = null;
        currEditShut = null;
    }
    editFloorRulesHtml();
}

function editFloorRulesHtml() {
    var sel = $('#'+floorRules);
    // fill tab with floor's rules
    var str='';
    var c=0;
    for (var w in windows) { // search for this room windows
        w = windows[w];
        str+='<p>Regole della window '+w.windowId+'</p>';
        var rules = w.rulesLists;
        for (var rule in rules) {
            if (isFloorRule(rule.priority)) {
                str+='<p>Nome regola: '+ rule.name+'</p>';
                ++c;
            }
        }
    }
    if (c != 0) {
        $(noFloorRules).hide();
        str+='<p>Trovate '+c+' regole</p>';
    } else {
        $(noFloorRules).fadeIn();
    }
    sel.find('.rules-list').html(str);
    addRuleButton.attr('data-toggle','1').appendTo(sel);
    $('ul.tabs').tabs('select_tab', floorRules);
}



/* ## ROOMS MANAGERS ## */
function addPoly(poly) {
    var index = polys.push(poly) - 1;
    return index;
}

function editRoom(index) {
    if (currEditPoly != index) {
        //reset currEditPoly shutter selection
        if (currEditPoly != null) {
            changeShuttersFillColor(currEditPoly,-1,false);
        }
        currEditPoly = index;
        currEditShut = null;
        changeShuttersFillColor(currEditPoly,-1,true);
        changePolysFillColor(index);
        if (canvas.getActiveObject()!==polys[index].fabricPoly) {
            canvas.setActiveObject(polys[index].fabricPoly);
        }
        editRoomRulesHtml(index);
    }
    if (currEditShut==null) {
        //reset currEditPoly shutter selection
        changeShuttersFillColor(currEditPoly,-1,true);
        editRoomRulesHtml(index);

    }
}

function editRoomRulesHtml(index) {
    var sel = $('#'+roomRules);
    // fill tab with room's rules
    var roomId = polys[index].id;
    var str='';
    var c = 0;
    for (var r in rooms) { // search for this room
        r = rooms[r];
        if (roomId == r.roomNum) {
            str+='<p>Regole della room '+roomId+', '+ r.name+'</p>';
            for (var w in windows) { // search for this room windows
                w = windows[w];
                if (w.room.key.raw.id==roomId) {
                    var rules = w.rulesLists;
                    for (var rule in rules) { //
                        rule = rules[rule];
                        if (isRoomRule(rule.priority)) {
                            str+='<p>Nome regola: '+ rule.name+'</p>';
                            ++c;
                        }
                    }
                }
            }
            break;
        }
    }
    if (c != 0) {
        $(noRoomRules).hide();
        str+='<p>Trovate '+c+' regole</p>';
    } else {
        $(noRoomRules).fadeIn();
    }

    sel.find('.rules-list').html(str);
    addRuleButton.attr('data-toggle','2').appendTo(sel);
    $('ul.tabs').tabs('select_tab', roomRules);
}

function changePolysFillColor(index) {
    for (var i=0; i<polys.length; ++i) {
        polys[i].changeFillColor(i==index);
    }
}


/* ## SHUTTER MANAGERS ## */
function editShutter(indexPoly, indexShut) {
    if (currEditPoly != indexPoly || currEditShut != indexShut) {
        // changed poly?
        if (currEditPoly != indexPoly) {
            if (currEditPoly != null) {// reset prev sel
                changePolysFillColor(currEditPoly);
                changeShuttersFillColor(currEditPoly, -1, false);
            }
            currEditPoly = indexPoly;
            changePolysFillColor(indexPoly);
        }
        // always change shutter
        currEditShut = indexShut;
        changeShuttersFillColor(currEditPoly, currEditShut, true);
        if (canvas.getActiveObject()!==polys[indexPoly].shutters[indexShut].fabricRect) {
            canvas.setActiveObject(polys[indexPoly].shutters[indexShut].fabricRect);
        }
        editShutterRulesHtml(indexPoly, indexShut);
    }
}

function editShutterRulesHtml(indexPoly, indexShut) {
    var sel = $('#'+windowRules);
    // fill tab with window's rules
    var roomId = polys[indexPoly].id;
    var shutId = polys[indexPoly].shutters[indexShut].id;
    var str='';
    var c=0;
    for (var r in rooms) { // search for this room
        if (roomId == r.roomNum) {
            for (var w in windows) { // search for this room windows
                if (w.room.key.raw.id==roomId) {
                    if (shutId == w.windowId) {
                        str+='<p>Regole della window '+shutId+'</p>';
                        var rules = w.rulesLists;
                        for (var rule in rules) {
                            if (isWindowRule(rule.priority)) {
                                str+='<p>Nome regola: '+ rule.name+'</p>';
                                ++c;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    if (c != 0) {
        $(noWindowRules).hide();
        str+='<p>Trovate '+c+' regole</p>';
    } else {
        $(noWindowRules).fadeIn();
    }
    sel.find('.rules-list').html(str);
    addRuleButton.attr('data-toggle','3').appendTo(sel);
    $('ul.tabs').tabs('select_tab', windowRules);
}

function changeShuttersFillColor(indexPoly, indexShutt, selRoom) {
    var p = polys[indexPoly];
    for (var i=0; i<p.shutters.length; ++i) {
        p.shutters[i].changeFillColor(i==indexShutt, selRoom);
    }
}

function getIndexOfShutter(shutter) {
    if (shutter != null) {
        for (var i=0; i<polys.length; ++i) {
            for (var k=0; k<polys[i].shutters.length; ++k) {
                if (polys[i].shutters[k].fabricRect === shutter) {
                    return {poly:i, shutter:k};
                }
            }
        }
    }
    return {poly:polys.length, shutter:null};
}


/* ## ADD RULE ## */
$(addRuleForm).on('submit', function() {
    // pre ajax request
    var buttonsRow = $(addHomeForm).find('.buttons-row').first();
    buttonsRow.find('button').hide();
    buttonsRow.append(preloader_wrapper('right'));

    // do an ajax req
    $.ajax({
        type: "POST",
        url: "/homes/add",
        data: $(this).serialize() // serializes the form's elements.
    })
        .done(function( data ) {
            data = data.toString();
            // rollback
            buttonsRow.find('.preloader-wrapper').remove();
            buttonsRow.find('button').show();
            if (data.indexOf("Ok")!=-1) { // if everything's ok
                Materialize.toast('Home added!', 3000, 'rounded');
                var id = data.substr(4, data.length-4);
                addListElement(id);
                $(addHomeForm).trigger("reset");
                // hide errors
                if ($('.removeHome').length==1) {
                    $(listHomes).show();
                    $('#noHomes').hide(500);
                }
            } else { // display error
                Materialize.toast('Ops! An error occured.', 3000, 'rounded');
                $('#addHomeErrors').html(data).fadeIn();
            }
        });
    return false; // avoid to execute the actual submit of the form.
});


(function() {
    if(showGridLines) {
        draw_grid();
    }

    canvas.observe("object:selected", function() {
        var index;
        var obj = canvas.getActiveObject();
        if (obj instanceof fabric.Polygon) {// poly selected
            index = getIndexOfPoly(obj);
            if (index != polys.length) {
                if (currEditPoly == index) {
                    currEditShut = null;
                }
                editRoom(index);
            }
        } else if (obj instanceof fabric.Rect) {// shutters
            index = getIndexOfShutter(obj);
            if (index.poly != polys.length) {
                editShutter(index.poly, index.shutter);
            }
        }
    });

    canvas.observe("selection:cleared", function() {
        editFloor();
    });

})();

