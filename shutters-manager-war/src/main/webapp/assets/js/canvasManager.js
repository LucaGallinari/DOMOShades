/**
 * Created by kalu on 07/03/15.
 *
 */
/* ## POLYS MANAGERS ## */
function addPoly(poly) {
    var index = polys.push(poly) - 1;
    addPolyToHtml(poly.id, poly.name);
    return index;
}

function removePoly(index) {
    // save id if it has one
    var polyId = polys[index].id;
    if (!polys[index].new) {
        addRemovedRoomToInput(polyId);
    }
    // remove from canvas and remake the list
    polys[index].remove(canvas);
    polys.splice(index, 1);
    removePolyHtml(polyId);
    canvas.renderAll();
}

function resetPolysStatusVars(){
    countRemoved=0;
    for (var i=0; i<polys.length; ++i) {
        var p = polys[i];
        p.modified = false;
        p.new = false;
        for (var k=0; k < p.shutters.length; ++k) {
            p.shutters[k].news = false;
        }
    }
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

function getPolyIndexById(id) {
    if (id != null) {
        for (var i=0; i<polys.length; ++i) {
            if (polys[i].id==id) {
                return i;
            }
        }
    }
    return null;
}

function cleanCurrentPoly() {
    currentPoly.remove(canvas);
    canvas.renderAll();
    edit=false;
}
function editPolyHtml(num, name) {
    var sel = $('#room'+num);
    sel.find(".collapsible-header").html(name);
    sel.find('input[name="room-name"]').val(name);
}
function removePolyHtml(num) {
    $('#room'+num).remove();
}
function addPolyToHtml(num, name){
    var str =
        '<li id="room'+num+'">' +
            '<div class="collapsible-header" data-toggle="'+num+'">'+name+'</div>' +
            '<div class="collapsible-body">' +
                '<div class="row col s12">' +
                    '<div class="row input-field col s12">' +
                        '<i class="mdi-action-account-circle prefix"></i>' +
                        '<input ' +
                            'name="room-name" ' +
                            'class="validate" ' +
                            'id="room-name'+num+'" ' +
                            'type="text" ' +
                            'value="'+name+'" ' +
                            'onchange="javascript:confirmName('+num+');">' +
                        '<label for="room-name'+num+'">Room\'s name</label>' +
                    '</div>' +
                    '<div class="row col s12">' +
                        '<ul class="shutters-list"></ul>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</li>';
    $('#rooms-list').append(str);
}

function editRoom(id, noclick, nosel, indexShutt) {
    var index = getPolyIndexById(id);
    var currEditIndex = getPolyIndexById(currentEdit);
    if (currentEdit != id) {
        //reset currentEdit shutter selection
        if (currEditIndex != null) {
            changeShuttersFillColor(currEditIndex, -1, false);
        }
        currentEdit = id;
        currEditIndex = index;
        changePolysFillColor(index);
        if (!nosel && canvas.getActiveObject()!==polys[index].fabricPoly) {
            canvas.setActiveObject(polys[index].fabricPoly);
        }
        editPolyHtml(id, polys[index].name);
        var sel =$('#room'+id);
        if (!sel.hasClass("active") && !noclick) {
            sel.find('.collapsible-header').click();
        }
    }
    if (indexShutt != null) {
        changeShuttersFillColor(currEditIndex, indexShutt, true);
    } else {
        changeShuttersFillColor(currEditIndex, -1, true);
    }
    $('#room-name'+id).focusin();
}

function removeEditRoom(){
    var index = getPolyIndexById(currentEdit);
    changeShuttersFillColor(index, -1, false);
    polys[index].changeFillColor(false);
    currentEdit = null;
    $('#rooms-list').find('.active').removeClass("active");
    $('.collapsible').collapsible();
}

function confirmName(id) {
    var index = getPolyIndexById(id);
    polys[index].setName($('#room'+id).find('input[name="room-name"]').val(), false);
    editPolyHtml(id, polys[index].name);
    canvas.renderAll();
}

/* ## SHUTTER MANAGERS ## */
function removeShutter(idPoly, indexShutter) {
    var indexPoly = getPolyIndexById(idPoly);
    polys[indexPoly].removeShutter(canvas, indexShutter);
    canvas.renderAll();
    refreshShuttersList(idPoly);
}

function refreshShuttersList(id){
    clearShuttersList(id);
    var shuttersList = $('#room'+id).find('.shutters-list');
    var shutters = polys[getPolyIndexById(id)].shutters;
    for (var i=0; i<shutters.length; ++i) {
        var str =
            '<li class="shutter'+i+'">' +
                '<div>Shutter'+shutters[i].id+'</div>' +
                '<div onclick="removeShutter('+id+','+i+');" class="item-icon"><i class="mdi-navigation-cancel"></i></div>' +
            '</li>';
        shuttersList.append(str);
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

function clearShuttersList(id) {
    $('#room'+id).find('.shutters-list').empty();
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

/* ## SAVE CANVAS ## */
function saveCanvas(form) {
    // pre ajax request
    var f = $(form);
    var sel = $('#savingModal');
    sel.leanModal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200 // Transition out duration
    });
    sel.openModal();
    if (saveRoomsDataToForm()) {
        // do an ajax req
        $.ajax({
            type: "POST",
            url: f.attr('action'),
            data: f.serialize()
        })
        .done(function(data) {
            data = data.toString();
            sel.closeModal();
            //$('#modifyHomeErrors').html(data);
            if (data=="Ok") { // if everything's ok
                resetPolysStatusVars();
                resetRoomsForm(form);
                Materialize.toast('Floor modified!', 3000, 'rounded');
            } else { // if not display error
                Materialize.toast('Ops! An error occured.', 3000, 'rounded');
                $('#saveCanvasErrors')
                    .html(
                        'An error occured while saving the floor. Some changes may have been lost.<br>' +
                        'This page will be reloaded within 3 seconds.')
                    .fadeIn();
                setTimeout(function(){
                    location.reload();
                }, 4000);
            }
        });
    } else {
        resetRoomsForm(form);
        sel.closeModal();
        Materialize.toast('Nothing changed so nothing to save!', 3000, 'rounded');
    }
}

function saveRoomsDataToForm() {
    var count=0;
    // process rooms
    for (var i =0; i<polys.length; ++i) {
        if (polys[i].new) {// new room
            addNewRoomToInput(i);
        } else {// already added room
            if (polys[i].modified) {
                addModifiedRoomToInput(i);
            } else { // not mod room
                addNotModRoomToInput(i);
                count++;
            }
        }
    }
    // copy floorType
    $('#floorType').val($('#typef').val());
    return ((countRemoved > 0) || (count != polys.length)); // if nothing changed,don't save
}

function resetRoomsForm(form){
    resetNewRoomInput(form);
    resetModifiedRoomInput(form);
    resetRemovedRoomInput();
    resetNotModRoomInput();
}


function addRemovedRoomToInput(id) {
    var sel = $('input[name="roomsRemoved"]');
    var val = sel.val();
    if (val == "") {
        sel.val(id);
    } else {
        sel.val(val+','+id);
    }
    countRemoved++;
}
function resetRemovedRoomInput() {
    $('input[name="roomsRemoved"]').val('');
}

function addModifiedRoomToInput(indexPoly) {
    // add id to the input
    var id = polys[indexPoly].id;
    var sel = $('input[name="roomsModified"]');
    var val = sel.val();
    if (val == "") {
        sel.val(id);
    } else {
        sel.val(val+','+id);
    }
    // add inputs for the room's data
    var jsondata = polys[indexPoly].toJson();
    $('#canvasForm').append('<input type="hidden" name="modRoomData'+id+'" value=\''+jsondata+'\' class="modRoom" />');
}
function resetModifiedRoomInput(form) {
    $('input[name="roomsModified"]').val('');
    $(form).find('.modRoom').remove();
}

function addNotModRoomToInput(indexPoly) {
    // add json to input
    var jsondata = polys[indexPoly].toJson();
    var sel = $('input[name="notModRooms"]');
    var val = sel.val();
    if (val == "") {
        sel.val(jsondata);
    } else {
        sel.val(val+','+jsondata);
    }
}
function resetNotModRoomInput() {
    $('input[name="notModRooms"]').val('');
}

function addNewRoomToInput(indexPoly) {
    // add id to the input
    var id = polys[indexPoly].id;
    var sel =$('input[name="roomsAdded"]');
    var val = sel.val();
    if (val == "") {
        sel.val(id);
    } else {
        sel.val(val+','+id);
    }
    // add inputs for the room's data
    var jsondata = polys[indexPoly].toJson();
    $('#canvasForm').append('<input type="hidden" name="addRoomData'+id+'" value=\''+jsondata+'\' class="newRoom" />');
}
function resetNewRoomInput(form) {
    $('input[name="roomsAdded"]').val('');
    $(form).find('.newRoom').remove();
}

(function() {
    if(showGridLines) {
        draw_grid();
    }

    canvas.observe("mouse:move", function (event) {
        var pos = canvas.getPointer(event.e);
        var realPos = {};
        if (mode == 1) {// add/edit room
            realPos = processPosition(pos);
            if (edit) {
                currentPoly.setLastPoint(realPos);
            }
            if (!pointerCircle) {
                pointerCircle = makeCircle(-20,-20,4);
                canvas.add(pointerCircle);
            }
            pointerCircle.set({
                left: realPos.x,
                top: realPos.y
            });

        } else if (mode==5) {// add shutter
            var closest = getClosestShuttersPoint(pos, 30);
            if (closest != null) {
                realPos = closest;
            }
            if(!pointerCircle) {
                pointerCircle = makeCircle(-20,-20,4);
                canvas.add(pointerCircle);
            }
            pointerCircle.set({
                left: realPos.x,
                top: realPos.y
            });
        }
        canvas.renderAll();
    });

    canvas.observe("mouse:down", function (event) {
        if (settings.useMouseClick) {
            var obj;
            var pos = canvas.getPointer(event.e);
            var realPos = {};
            var indexes;
            var polyId;
            if (mode == 1) {// add/edit room
                longClickPolyTimeout = setTimeout(function(pos){
                    longClickPoly = true;

                    var realPos = processPosition(pos);
                    currentPoly.addPoint(realPos);

                    // confirm poly
                    removePointerCircle();
                    var ret = currentPoly.confirm(function(x, y){
                        var c = makeCircle(x, y, 4);
                        canvas.add(c);
                        return c;
                    }, true);
                    if (ret != 1) { // not ok
                        cleanCurrentPoly();
                        Materialize.toast('A room must have at least 3 points!', 3000, 'rounded');
                    } else {
                        var i = addPoly(currentPoly);
                        $('.collapsible').collapsible();
                        editRoom(currentPoly.id, false, false, null);
                        edit = false;
                        canvas.add(currentPoly.fabricText);
                    }
                    changeMode(0);
                    currentPoly=null;
                }, 500, pos);
            } else if (mode==2) {//remove poly
                obj = canvas.getActiveObject();
                if (obj instanceof fabric.Polygon) {
                    var indexPoly = getIndexOfPoly(obj);
                    if (indexPoly != polys.length) {
                        removePoly(indexPoly);
                    }
                }
            } else if (mode==5) {// add shutter

                var closest = getClosestShuttersPoint(pos, 30);
                if (closest != null) {
                    realPos.x = closest.x;
                    realPos.y = closest.y;
                    var polyIndex = closest.poly;
                    polyId = polys[polyIndex].id;
                    var shutter = polys[polyIndex].addShutter(realPos, null, null, true);
                    indexes = getIndexOfShutter(shutter.fabricRect);
                    refreshShuttersList(polyId);
                    canvas.add(shutter.fabricRect);
                    editRoom(polyId, false, true, indexes.shutter);
                    //canvas.setActiveObject(shutter.fabricRect);
                }
            } else if (mode==6) {//remove shutter
                obj = canvas.getActiveObject();
                if (obj instanceof fabric.Rect) {
                    indexes = getIndexOfShutter(obj);
                    if (indexes.poly != polys.length) {
                        polyId = polys[indexes.poly].id;
                        removeShutter(polyId, indexes.shutter);
                        editRoom(polyId, false, false, null);
                    }
                }
            }
            canvas.renderAll();
        }
    });

    canvas.observe("mouse:up", function (event) {
        if (settings.useMouseClick) {
            if(mode==1) {
                clearTimeout(longClickPolyTimeout);
                var pos = canvas.getPointer(event.e);
                var realPos = processPosition(pos);
                if (edit) {// edit polygon
                    currentPoly.addPoint(realPos);
                } else {// add polygon
                    if (longClickPoly) {
                        longClickPoly=false;
                    }
                    currentPoly = new PolygonExtended(realPos, null, "New room");
                    canvas.add(currentPoly.fabricPoly);
                    edit = true;
                }
            }
        }
    });

    canvas.observe("object:selected", function() {
        var index;
        var polyId;
        var obj = canvas.getActiveObject();
        if (obj instanceof fabric.Polygon || obj instanceof fabric.Text) {// poly selected
            index =  (obj instanceof fabric.Polygon) ? getIndexOfPoly(obj) : getIndexOfPolyByText(obj);
            if (index != polys.length) {
                polyId = polys[index].id;
                if (mode == 2) { // remove poly
                    removePoly(index);
                } else if (mode == 0 || mode == 1) {
                    if (currentEdit != polyId) {
                        editRoom(polyId, false, true, null);
                    } else {
                        changeShuttersFillColor(index, -1, true);
                    }
                }
            }
        } else if (obj instanceof fabric.Rect) {// shutters
            index = getIndexOfShutter(obj);
            if (index.poly != polys.length) {
                polyId = polys[index.poly].id;
                if (mode == 6) { // remove shutter
                    removeShutter(polyId, index.shutter);
                    editRoom(polyId, false, false, null);
                } else if (mode == 5) { //add
                    editRoom(polyId, false, true, null);
                } else if (mode == 0) { // normal
                    editRoom(polyId, false, true, index.shutter);
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

    fabric.util.addListener(window, 'keyup', function (e) {
        if (settings.useShortcuts) {
            if (e.keyCode == 27) {// esc
                if (edit && currentPoly) { // confirm poly
                    removePointerCircle();
                    var ret = currentPoly.confirm(function(x, y){
                        var c = makeCircle(x, y, 4);
                        canvas.add(c);
                        return c;
                    }, true);
                    if (ret != 1) { // not ok
                        cleanCurrentPoly();
                    } else {
                        var i = addPoly(currentPoly);
                        $('.collapsible').collapsible();
                        editRoom(polys[i].id, false, false, null);
                        edit = false;
                        canvas.add(currentPoly.fabricText);
                    }
                    canvas.renderAll();
                    changeMode(0);
                } else {
                    if (mode==1) {
                        changeMode(0);
                    } else {
                        changeMode(1);
                    }
                }
                currentPoly = null;
            } else if (e.keyCode == 81 || e.keyCode == 113) {// Q or q
                toggleShowGridLines();
            } else if (e.keyCode == 107 || e.keyCode == 187) {// + numpad or + keyboard
                zoomGridSpaces('+');
            } else if (e.keyCode == 109 || e.keyCode == 189) {// - numpad or - keyboard
                zoomGridSpaces('-');
            } else if (e.keyCode == 88) {// x or X
                if (currentPoly) {
                    currentPoly.removeLastPoint();
                }
                canvas.renderAll();
            } else if (e.keyCode == 46) {// canc
                var obj = canvas.getActiveObject();
                var index;
                if (obj instanceof fabric.Polygon) {
                    index = getIndexOfPoly(obj);
                    if (index!= polys.length) {
                        removePoly(index);
                        canvas.renderAll();
                    }
                } else if (obj instanceof fabric.Rect) {
                    index = getIndexOfShutter(obj);
                    if (index.poly != polys.length) {
                        var polyId = polys[index.poly].id;
                        removeShutter(polyId, index.shutter);
                        editRoom(polyId, false, false, null);
                    }
                }
            }
        }
    });
})();

