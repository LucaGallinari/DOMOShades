var floorRules  = '#floorRules';
var roomRules   = '#roomRules';
var windowRules = '#windowRules';

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

function editRoomRuleHtml(index) {
    // switch tab
    $('ul.tabs').tabs('select_tab', roomRules);
    // fill tab with rooms' rules
    var roomId = polys[index].id;
    $(roomRules).html('');
    var str='';

    for (var r in rooms) { // search for this room
        if (roomId == r.roomNum) {
            str+='<p>Regole della room '+roomId+', '+ r.name+'</p>';
            for (var w in windows) { // search for this room windows
                if (w.room.key.raw.id==roomId) {
                    var rules = w.rulesLists;
                    str+='<p>Trovate '+rules.length+' regole</p>';
                    for (var rule in rules) { //
                        if (isRoomRule(rule.priority)) {
                            str+='<p>Nome regola: '+ rule.name+'</p>';
                        }
                    }
                }
            }

            break;
        }
    }
    $(roomRules).html(str);
}

function addPolyToHtml(index){
    //var str ='';
}

function editRoom(index) {
    if (currEditPoly != index) {
        //reset currEditPoly shutter selection
        if (currEditPoly != null) {
            changeShuttersFillColor(currEditPoly, -1, false);
        }
        currEditPoly = index;
        currEditShut = null;
        changePolysFillColor(index);
        if (canvas.getActiveObject()!==polys[index].fabricPoly) {
            canvas.setActiveObject(polys[index].fabricPoly);
        }
        editRoomRuleHtml(index);
    }
    /*
    if (indexShutt != null) {
        changeShuttersFillColor(currEditIndex, indexShutt, true);
    } else {
        changeShuttersFillColor(currEditIndex, -1, true);
    }*/
}

function removeEditRoom(){
    var index = currEditPoly;
    changeShuttersFillColor(index, -1, false);
    polys[index].changeFillColor(false);
    currEditPoly = null;
    $('#rooms-list').find('.active').removeClass("active");
    $('.collapsible').collapsible();
}


/* ## SHUTTER MANAGERS ## */

function editShutter(indexPoly, indexShut) {
    /*if (currEditShut != indexShut) {
        //reset currEditPoly shutter selection
        if (currEditShut != null) {
            changeShuttersFillColor(currEditPoly, -1, false);
        }
        currEditPoly = index;
        currEditShut = null;
        changePolysFillColor(index);
        if (canvas.getActiveObject()!==polys[index].fabricPoly) {
            canvas.setActiveObject(polys[index].fabricPoly);
        }
        editRoomRuleHtml(index);
    }*/
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
                if (currEditShut != index) {
                    editShutter(index.shutter, index.poly);
                }
            }
        }
    });

    canvas.observe("selection:cleared", function() {
        if (mode < 5) {// rooms
            removeEditRoom();
        }
    });

    canvas.observe("before:selection:cleared", function() {
        var obj = canvas.getActiveObject();
        if (obj instanceof fabric.Rect) {// shutters
            var index = getIndexOfShutter(obj);
            changeShuttersFillColor(index.poly, -1, false);
        }
    });

})();

