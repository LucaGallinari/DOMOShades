var floorRules  = 'floorRules';
var roomRules   = 'roomRules';
var windowRules = 'windowRules';
var noFloorRules    = '#noFloorRules';
var noRoomRules     = '#noRoomRules';
var noWindowRules   = '#noWindowRules';
var floorVisual    = '#floorVisual';
var roomVisual     = '#roomVisual';
var windowVisual   = '#windowVisual';

var addRuleForm = '#addRuleForm';

var currEditPoly = null;
var currEditShut = null;
var rulesList = [];
/*
 1, floor
 2, room
 3, window
 */
var scope = 1;

/* HELPERS */
function isHomeRule(val){
    return val==100;
}
function isFloorRule(val){
    return between(val,67,99);
}
function isRoomRule(val){
    return between(val,34,66);
}
function isWindowRule(val){
    return between(val,1,33);
}
function isDefaultRule(val){
    return val==0;
}
function between(x, min, max) {
    return x >= min && x <= max;
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

function getShutIndexById(polyIndex, id) {
    if (id != null) {
        for (var i=0; i<polys[polyIndex].shutters.length; ++i) {
            if (polys[polyIndex].shutters[i].id == id) {
                return i;
            }
        }
    }
    return null;
}

/* ## RULES MANAGER ## */
function isRuleEqual(rule1, rule2) {
    return (
        rule1.name==rule2.name &&
        rule1.startTime.h==rule2.startTime.h &&
        rule1.startTime.m==rule2.startTime.m &&
        rule1.endTime.h==rule2.endTime.h &&
        rule1.endTime.m==rule2.endTime.m &&
        rule1.closedPercentage==rule2.closedPercentage
    );
}

function ruleAlreadyInserted(rule, rulesList) {
    for (var r=0; r < rulesList.length; ++r) {
        if (isRuleEqual(rulesList[r], rule)) {
            return r;
        }
    }
    return -1;
}

function roomAlreadyInserted (roomId, ruleIndex) {
    for (var room=0; room < rulesList[ruleIndex].rooms.length; ++room) {// search if room already present
        if (rulesList[ruleIndex].rooms[room].id == roomId) {
            return room;
        }
    }
    return -1;
}

function addWindowToRuleList(ruleIndex, w, priority) {
    var roomIndex = roomAlreadyInserted(w.room.key.raw.id, ruleIndex);
    var objShut = {"id": w.windowId, "priority":priority};

    if (roomIndex == -1) { // room not found, add
        var objRoom = {"id": w.room.key.raw.id, "windows":[]};
        roomIndex = rulesList[ruleIndex].rooms.push(objRoom) - 1;
    }
    rulesList[ruleIndex].rooms[roomIndex].windows.push(objShut);
}

function updateRulesList(str, selectTab, norules) {
    var sel = $('#'+selectTab);
    if (str != '') {
        $(norules).hide();
        sel.find('.rules-list').html(rules_table());
        sel.find('#listRules').html(str);
    } else {
        $(norules).fadeIn();
        sel.find('.rules-list').html('');
    }
    $('ul.tabs').tabs('select_tab', selectTab);
}

function updateTimetable(selectTab) {
    var sel = $('#'+selectTab);
    var str = '';
    var wnum = 60*24;
    var width = $('#rulesArea').width()-170;
    var wdelta = width / wnum;
    // sort
    var rulesListSorted = [];
    for (var rule in rulesList) {
        var rule = rulesList[rule];
        rulesListSorted.push([rule, rule.startTime]);
    }
    rulesListSorted.sort(function(r1, r2){return (r1[1].hour*60 + r1[1].minutes) - (r2[1].hour*60 + r2[1].minutes) });
    console.log(rulesListSorted);

    //
    var startTime1 = null;
    for (var rule in rulesListSorted) {
        var printLast = true;
        var i = parseInt(rule);
        var ruleWidth;
        var rule = rulesListSorted[rule];

        str += '<div style="width:100%;display:inline-flex;">' +
                    '<div style="width:150px;">'+rule[0].name+'</div>' +
                    '<div style="width:100%;position:relative;" class="timeline">';

        if (startTime1==null || startTime1 < (rule[1].hour*60 + rule[1].minutes)) {
            startTime1 = (rule[1].hour*60 + rule[1].minutes);
        } else {
            var realStartTime1 = (rule[1].hour*60 + rule[1].minutes);
            ruleWidth = (startTime1 - realStartTime1) * wdelta;
            str += '<div style="background-color:#aaa;position:absolute; left:'+realStartTime1*wdelta+'px; width:'+ruleWidth+'px; z-index:2;opacity:0.5;">&nbsp;</div>';
        }
        var endTime1 = (rule[0].endTime.hour*60 + rule[0].endTime.minutes);


        if (i != rulesListSorted.length-1) {
            for (var k=i+1; k<rulesListSorted.length; ++k) {
                var rule2 = rulesListSorted[k];
                // collision and low priority, add a div until new rule starttime
                if (checkRulesCollision(rule[0], rule2[0])) {
                    if (rule[0].priority < rule2[0].priority) { // actual rule hasn't a higher priority
                        // add black div
                        // var startTime1 = (rule[1].hour*60 + rule[1].minutes) * wdelta;
                        var startTime2 = (rule2[1].hour*60 + rule2[1].minutes);
                        var endTime2 = (rule2[0].endTime.hour*60 + rule2[0].endTime.minutes);
                        if (startTime2 >= startTime1) {
                            str += getBlock(0, startTime1*wdelta, (startTime2 - startTime1) * wdelta);
                            str += getBlock(1, startTime2*wdelta, (endTime1 - startTime2) * wdelta);
                            // no sense to continue if this collision goes over actual rule endtime
                            if (endTime2 >= endTime1) {
                                printLast = false; break;
                            } else {
                                startTime1 = endTime2;
                            }
                        }
                    }
                }
            }
        }
        // all collision has been checked but i am not at the end of my time, wrote a div until that
        if (printLast) {
            // add black div
            var startTime = startTime1 * wdelta;
            ruleWidth  = (endTime1 * wdelta - startTime);
            startTime1 = endTime1;
            str += '<div style="background-color:#000;position:absolute; left:'+startTime+'px; width:'+ruleWidth+'px; z-index:2;opacity:0.5;">&nbsp;</div>';
        }

        str += getVerticalLineBlocks(width, 0);
        str += '</div></div>';
    }

    // last line with hours and lines
    str += '<div style="width:100%;display:inline-flex;">' +
                '<div style="width:150px;">&nbsp;</div>' +
                '<div style="width:100%;position:relative;" class="timeline">';

    str += getVerticalLineBlocks(width, 1);
    str += '</div></div>';

    sel.find('.rules-timetable').html(str);
}

function getBlock(type, left, width) {
    var color = (type==0 ? '#000' : '#aaa');
    return '<div style="background-color:'+color+';position:absolute; ' +
                 'left:'+left+'px; width:'+width+'px; ' +
                 'z-index:2; opacity:0.5;">&nbsp;</div>';
}
function getVerticalLineBlocks(width, type) {
    var str = '';
    var whour = width / 24;
    for (var j=0; j < 24; ++j) {
        str += '<div style="border-right:1px solid #aaa;position:absolute; ' +
                    'left:'+(j*whour)+'px; width:'+whour+'px; ' +
                    'text-align:center;z-index:1">' +
                    ''+(type==0 ? '&nbsp;' : j)+'</div>';
    }
    return str;
}

/* ## FLOOR MANAGERS ## */
function editFloor(){
    var sel = $('#'+floorRules);
    scope = 1;
    if (currEditPoly!=null) {
        changeShuttersFillColor(currEditPoly, -1, false);
        polys[currEditPoly].changeFillColor(false);
        currEditPoly = null;
        currEditShut = null;
    }
    editFloorRulesHtml();
    updateTimetable(floorRules);
    if ($(floorVisual).is(':checked')) {
        $(sel).find('.rules-list').hide();
        $(sel).find('.rules-timetable').show();
    } else {
        $(sel).find('.rules-timetable').hide();
        $(sel).find('.rules-list').show();
    }
}

function editFloorRulesHtml() {
    var sel = $('#'+floorRules);
    // fill tab with floor's rules
    rulesList = [];
    var str='';
    for (var w in windows) { // search for windows
        w = windows[w];
        var rules = w.rulesLists;
        for (var rule in rules) {
            rule = rules[rule];
            if (isFloorRule(rule.priority) || isHomeRule(rule.priority)) {
                var ruleIndex = ruleAlreadyInserted(rule, rulesList);
                if (ruleIndex == -1) {// not found, add rule
                    rule.rooms = [];
                    ruleIndex = rulesList.push(rule) - 1;
                    str += rules_table_element(rule, ruleIndex);
                }
                addWindowToRuleList(ruleIndex, w, rule.priority);
            }
        }
    }
    updateRulesList(str, floorRules, noFloorRules);
}



/* ## ROOMS MANAGERS ## */
function addPoly(poly) {
    var index = polys.push(poly) - 1;
    return index;
}

function editRoom(index) {
    scope = 2;
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
    // fill tab with room's rules
    var roomId = polys[index].id;
    rulesList = [];
    var str='';
    if (roomId != null) {
        for (var r in rooms) { // search for this room
            r = rooms[r];
            if (roomId == r.roomNum) {
                for (var w in windows) { // search for this room windows
                    w = windows[w];
                    if (w.room.key.raw.id==r.roomNum) {
                        var rules = w.rulesLists;
                        for (var rule in rules) { //
                            rule = rules[rule];
                            if (isRoomRule(rule.priority)) {
                                var ruleIndex = ruleAlreadyInserted(rule, rulesList);
                                if (ruleIndex == -1) {// not found, add rule
                                    rule.rooms = [];
                                    ruleIndex = rulesList.push(rule) - 1;
                                    str += rules_table_element(rule, ruleIndex);
                                }
                                addWindowToRuleList(ruleIndex, w, rule.priority);
                            }
                        }
                    }
                }
                break;
            }
        }
    } else {
        // TODO: do something
    }
    updateRulesList(str, roomRules, noRoomRules);
}

function getRoomsIds() {
    var str = '';
    for (var r in rooms) { // search for this room
        str += rooms[r].roomNum + ",";
    }
    if (str.length>0) {
        str = str.substring(0, str.length-1);// last comma
    }
    return str;
}
function getWindowsIdsByRoom(roomId) {
    var str = '';
    for (var r in rooms) { // search for this room
        r = rooms[r];
        if (roomId == r.roomNum) {
            for (var w in windows) { // search for this room windows
                w = windows[w];
                if (w.room.key.raw.id == roomId) {
                    str += w.windowId + ",";
                }
            }
        }
    }
    if (str.length>0) {
        str = str.substring(0, str.length-1);// last comma
    }
    return str;
}

function changePolysFillColor(index) {
    for (var i=0; i<polys.length; ++i) {
        polys[i].changeFillColor(i==index);
    }
}
function resetPolysAndShutsFillColor() {
    for (var i=0; i<polys.length; ++i) {
        polys[i].changeFillColor(false);
        resetShutsFillColor(i);
    }
}
function resetShutsFillColor(polyIndex) {
    var shuts = polys[polyIndex].shutters;
    for (var k=0; k < shuts.length; ++k) {
        shuts[k].changeFillColor(false, false);
    }
}

function selectPolysAndShuttersByRule(ruleIndex) {
    if (rulesList != null) {
        if (rulesList.length > 0) {
            var rule = rulesList[ruleIndex];
            // polys
            for (var i=0; i < rule.rooms.length; ++i) {
                var room = rule.rooms[i];
                var polyIndex = getPolyIndexById(room.id);
                polys[polyIndex].changeFillColor(true);
                // windows
                for (var k=0; k < room.windows.length; ++k) {
                    var shut = room.windows[k];
                    var shutIndex = getShutIndexById(polyIndex, shut.id);
                    polys[polyIndex].shutters[shutIndex].changeFillColor(true, true);
                }
            }
        }
    }
}


/* ## SHUTTER MANAGERS ## */
function editShutter(indexPoly, indexShut) {
    scope = 3;
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
    // fill tab with window's rules
    var roomId = polys[indexPoly].id;
    var shutId = polys[indexPoly].shutters[indexShut].id;
    rulesList = [];
    var str='';
    for (var r in rooms) { // search for this room
        r = rooms[r];
        if (roomId == r.roomNum) {
            for (var w in windows) { // search for this room windows
                w = windows[w];
                if (w.room.key.raw.id==r.roomNum) {
                    if (shutId == w.windowId) {
                        var rules = w.rulesLists;
                        for (var rule in rules) {
                            rule = rules[rule];
                            if (isWindowRule(rule.priority) || isDefaultRule(rule.priority)) {
                                var ruleIndex = ruleAlreadyInserted(rule, rulesList);
                                if (ruleIndex == -1) {// not found, add rule
                                    rule.rooms = [];
                                    ruleIndex = rulesList.push(rule) - 1;
                                    str += rules_table_element(rule, ruleIndex);
                                }
                                addWindowToRuleList(ruleIndex, w, rule.priority);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    updateRulesList(str, windowRules, noWindowRules);
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
    var buttonsRow = $(addRuleForm).find('.buttons-row').first();
    buttonsRow.find('button').hide();
    buttonsRow.append(preloader_wrapper('right'));

    var obj = calculatePriorities();
    if (obj == null) {
        Materialize.toast("Start and end times must be set!", 3000);
        return false;
    }
    var objJson = JSON.stringify(obj);
    $(addRuleForm).append('<input type="hidden" name="priorities" value=\''+objJson+'\' />');
    // $(addRuleForm).submit();

    return true; // avoid to execute the actual submit of the form.*/
});

function getPriorityType(priority) {
    if (isFloorRule(priority))         return 1;
    else if (isRoomRule(priority))     return 2;
    else if (isWindowRule(priority))   return 3;
}

function checkRulesCollision(rule1, rule2) {
    // set dates
    var startTime1  = new Date(2015, 0, 1, parseInt(rule1.startTime.hour), parseInt(rule1.startTime.minutes));
    var endTime1    = new Date(2015, 0, 1, parseInt(rule1.endTime.hour), parseInt(rule1.endTime.minutes));
    var startTime2  = new Date(2015, 0, 1, parseInt(rule2.startTime.hour), parseInt(rule2.startTime.minutes));
    var endTime2    = new Date(2015, 0, 1, parseInt(rule2.endTime.hour), parseInt(rule2.endTime.minutes));
    // get times
    startTime1 = startTime1.getTime();
    endTime1 = endTime1.getTime();
    startTime2 = startTime2.getTime();
    endTime2 = endTime2.getTime();
    // check
    return ((startTime1 <= endTime2) &&  (endTime1 > startTime2));
}

function checkRulesCollisionSpecial(rule1, newRuleStart, newRuleEnd) {
    // split times
    var startT2 = newRuleStart.split(":");
    var endT2   = newRuleEnd.split(":");
    var rule2 = {
        startTime: {hour: startT2[0], minutes: startT2[1]},
        endTime: {hour: endT2[0], minutes: endT2[1]}
    };
    return checkRulesCollision(rule1, rule2);
}

function calculatePriorities() {
    var roomId = null;
    var shutId = null;
    if (currEditPoly != null) {
        roomId = polys[currEditPoly].id;
    }
    if (currEditShut != null) {
        shutId = polys[currEditPoly].shutters[currEditShut].id;
    }

    var newRuleStartTime = $(addRuleForm).find('input[name="startTime"]').val();
    var newRuleEndTime = $(addRuleForm).find('input[name="endTime"]').val();

    if (newRuleStartTime == "" || newRuleEndTime == "") {
        return null;
    }

    var obj = {"rooms":[]};

    for (var r in rooms) { // search rooms
        //if (!rooms.hasOwnProperty(r)) {return null;}
        r = rooms[r];
        if (roomId == r.roomNum || roomId == null) {
            var objRoom = {"id": r.roomNum, "windows":[]};
            for (var w in windows) { // search windows
                w = windows[w];
                if (w.room.key.raw.id == r.roomNum) {//only this room's windows
                    if (shutId == w.windowId || shutId == null) {
                        var rules = w.rulesLists;
                        var priority = (3-scope)*33 + 1;
                        for (var rule in rules) {
                            rule = rules[rule];
                            if (scope == getPriorityType(rule.priority)) {
                                // check collision with other rules, if it does and the prioirty of this
                                // rule is greater than actual, set it doing + 1
                                if (checkRulesCollisionSpecial(rule, newRuleStartTime, newRuleEndTime)) {
                                    // Materialize.toast("Times collision!", 3000);
                                    if (rule.priority >= priority) {
                                        priority = rule.priority + 1;
                                    }
                                }
                            }
                        } //end for rules
                        var objShut = {"id": w.windowId, "priority":priority};
                        objRoom.windows.push(objShut);
                    }
                    // roomId is equal to curr room loop, break cause we already processed that
                    if (shutId == w.windowId) {
                        break;
                    }
                }
            }//end for windows
            obj.rooms.push(objRoom);
        }
        // roomId is equal to curr room loop, break cause we already processed that
        if (roomId == r.roomNum) {
            break;
        }
    }//end for rooms
    return obj;
}


/* ## REMOVE RULE ## */
$('#rulesArea').on('click', '.removeRule', function() {
    var ruleIndex = $(this).attr('data-toggle');
    var sel = $('#confirmModal');
    sel.find('input[name="targetRule"]').val(ruleIndex);
    sel.openModal();
});

$('.modal-footer').on('click', '#agreeRemove', function() {
    var ruleIndex = parseInt($('#confirmModal').find('input[name="targetRule"]').val());
    var home = $(addRuleForm).find('input[name="home"]').val();
    var floor = $(addRuleForm).find('input[name="floor"]').val();
    var objJson = JSON.stringify(rulesList[ruleIndex]);
    var form = jQuery("<form>", {
        action:'/rules/?mode=remove&home='+home+'&floor='+floor,
        method: 'POST'
    }).append('<input type="hidden" value=\''+objJson+'\' name="targets" />');
    form.appendTo('body').submit();
});


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

function rules_table_element(rule, index) {
    var str = ' \
        <tr data-toggle="'+(index)+'"> \
            <td class="null"></td>\
            <td class="name"><strong>'+rule.name+'</strong></td> \
            <td class="starttime"> starts at <strong>'+rule.startTime.hour+':'+ (rule.startTime.minutes == '0' ? rule.startTime.minutes+'0' : rule.startTime.minutes) +'</strong></td> \
            <td class="endtime"> ends at <strong>'+rule.endTime.hour+':'+ (rule.endTime.minutes == '0' ? rule.endTime.minutes+'0' : rule.endTime.minutes) +'</strong></td> \
            <td class="closedPerc"> shutters closed at <strong>'+rule.closedPercentage+'&#37;</strong></td> \
            <td>';
    if (rule.priority!=0 && rule.priority!=100) {
        str += '<a data-toggle="'+(index)+'" class="small waves-effect waves-red btn-flat removeRule tooltipped right" data-position="right" data-delay="50" data-tooltip="Remove Rule"> \
                    <i class="mdi-content-clear red-text"></i> \
                </a>'
    }
    str += '</td> \
        </tr>';
    $('.tooltipped').tooltip({delay: 0});
    return str;
}

function rules_table() {
    return ' \
        <table class="hoverable"> \
            <tbody id="listRules"> \
            </tbody> \
        </table>';
}



/* ## CANVAS ADAPTER ## */

function calcRoomsMinAndMaxCoords(rooms){
    var min = {x:null, y:null};
    var max = {x:null, y:null};
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        var vals = calculateMinMaxAbsCoords(room);
        // x
        if (min.x == null || min.x > vals.min.x) { min.x = vals.min.x;}
        if (max.x == null || max.x < vals.max.x) { max.x = vals.max.x;}
        // y
        if (min.y == null || min.y > vals.min.y) { min.y = vals.min.y;}
        if (max.y == null || max.y < vals.max.y) { max.y = vals.max.y;}
    }
    return {min: min, max: max};
}


function adjustRoomsPos (rooms, actualCenter, destCenter) {

    for (var i = 0; i < rooms.length; i++) {
        var r = rooms[i];
        // adjust rooms position
        r.pos = {
            left: r.pos.left - actualCenter.x + destCenter.x,
            top: r.pos.top - actualCenter.y + destCenter.y
        };
        for (var k=0; k< r.shutters.length; ++k) {
            var s = r.shutters[k];
            s.pos = {
                x: s.pos.x - actualCenter.x + destCenter.x,
                y: s.pos.y - actualCenter.y + destCenter.y
            };
        }
    }
    return rooms;
}

function calculateMinMaxAbsCoords (room) {
    var vals = { min: {x:null, y:null}, max: {x:null, y:null}};
    var pCenter = room.pos;
    var adjPoints = room.points.map(function(p) {
        return {
            x: Math.round(p.x + pCenter.left),
            y: Math.round(p.y + pCenter.top)
        };
    });
    for (var i=0; i < adjPoints.length; ++i) {
        var p = adjPoints[i];
        // x
        if (vals.min.x == null || vals.min.x > p.x) { vals.min.x = p.x;}
        if (vals.max.x == null || vals.max.x < p.x) { vals.max.x = p.x;}
        // y
        if (vals.min.y == null || vals.min.y > p.y) { vals.min.y = p.y;}
        if (vals.max.y == null || vals.max.y < p.y) { vals.max.y = p.y;}

    }
    return vals;
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
        } else if (obj instanceof fabric.Text) {// text
            index = getIndexOfPolyByText(obj);
            if (index != polys.length) {
                if (currEditPoly == index) {
                    currEditShut = null;
                }
                editRoom(index);
            }
        }
    });

    canvas.observe("selection:cleared", function() {
        editFloor();
    });

})();

