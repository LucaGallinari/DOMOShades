var floorRules  = 'floorRules';
var roomRules   = 'roomRules';
var windowRules = 'windowRules';

var currEditPoly = null;
var currEditShut = null;


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

/* ## POLYS MANAGERS ## */
function addPoly(poly) {
    var index = polys.push(poly) - 1;
    addPolyToHtml(index);
    return index;
}

function changePolysFillColor(index) {
    for (var i=0; i<polys.length; ++i) {
        if (i==index) {
            polys[i].changeFillColor(true);
        } else {
            polys[i].changeFillColor(false);
        }
    }
}

function editRoomRulesHtml(index) {
    // switch tab
    var sel = $('#'+roomRules);
    $('ul.tabs').tabs('select_tab', roomRules);
    // fill tab with rooms' rules
    var roomId = polys[index].id;
    sel.html('');
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
        str+='<p>Trovate '+c+' regole</p>';
    } else {
        str+='<p>No rules found for this room.</p>';
    }
    sel.html(str);
}

function addPolyToHtml(index){
    //var str ='';
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
}

function removeEdit(){
    var index = currEditPoly;
    changeShuttersFillColor(index, -1, false);
    polys[index].changeFillColor(false);
    currEditPoly = null;
    currEditShut = null;
    $('#rooms-list').find('.active').removeClass("active");
    $('.collapsible').collapsible();
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
    // switch tab
    $('ul.tabs').tabs('select_tab', windowRules);
    // fill tab with rooms' rules
    var roomId = polys[indexPoly].id;
    var shutId = polys[indexPoly].shutters[indexShut].id;
    $('#'+windowRules).html('');
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
                            if (isDefaultRule(rule.priority)) {
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
        str+='<p>Trovate '+c+' regole</p>';
    } else {
        str+='<p>No rules found for this window.</p>';
    }
    $('#'+windowRules).html(str);
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


function changeShuttersFillColor(indexPoly, indexShutt, selRoom) {
    var p = polys[indexPoly];
    for (var i=0; i<p.shutters.length; ++i) {
        if (i==indexShutt) {
            p.shutters[i].changeFillColor(true, null);
        } else {
            p.shutters[i].changeFillColor(false, selRoom);
        }
    }
}

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
                if (currEditPoly != index) {
                    editRoom(index);
                } else {
                    changeShuttersFillColor(index, -1, true);
                }
            }
        } else if (obj instanceof fabric.Rect) {// shutters
            index = getIndexOfShutter(obj);
            if (index.poly != polys.length) {
                editShutter(index.poly, index.shutter);
            }
        }
    });

    canvas.observe("selection:cleared", function() {
        removeEdit();
    });


})();

