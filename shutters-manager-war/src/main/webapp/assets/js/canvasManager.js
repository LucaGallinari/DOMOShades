/**
 * Created by kalu on 07/03/15.
 *
 * TODO:
 * - Better selection shape on objects focus
 * - Change shape of shutters and shutter' pointer
 */


var area = w = $(window).width();
if (w > 768) {
    if (w > 992) {
        area=area/12*8;
    } else {
        area=area/12*10;
    }
    area-=60; // margins and paddings
    $('#fabric').attr('width', Math.round(area*0.65));
    $('#list').css('width', Math.round(area*0.35));
} else {
    area-=30; // margins and paddings
    $('#fabric').attr('width', Math.round(area));
}


var canvas = new fabric.Canvas('fabric');
//fabric.Object.prototype.transparentCorners = false;

/*
* mode: 0, normal
*       1, add room
*       2, remove room
*       3, ?
*       4, ?
*       5, add shutter
*       6, remove shutter
*/
var mode = 0;
var modeButtons = [
    null,
    '#addRoom',
    '#removeRoom',
    null,
    null,
    '#addShutter',
    '#removeShutter'
];
var edit=false;

var pointerCircle;
var polys = [];
var currentEdit = null;
var currentPoly = null;

/* Grid Lines */
var gridLines = [];
var gridSpaces = {x:20, y:20};
var dashArray = [5, 5];
var showGridLines = false;

/* ######### ######### ######### ######### ######### #########
 * PolygonExtended is the extension of the Polygon object defined
 * by fabricjs. Doing this i can add some useful methods for the app.
 */
function PolygonExtended(pos, id, name) {
    // reference to the original object
    this.fabricPoly = new fabric.Polygon([{
        x: pos.x,
        y: pos.y
    },{
        x: pos.x,
        y: pos.y
    }], {
        strokeWidth: 2,
        stroke: '#222222',
        fill: null,
        opacity: 0.5,
        selectable: true,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        left: pos.x,
        top: pos.y
    });

    // custom properties
    if (id==null) { //new room
        this.id = getAvailableRoomID();
        this.new = true;
    } else {
        this.id = id;
        this.new = false;
    }
    this.name = name;
    this.modified = false;

    // arrays
    this.cornersCircles = [];
    this.shutters = [];
}
/*
 * Add a point to the polygon.
 * @pos Object with x and y variables
 */
PolygonExtended.prototype.addPoint = function (pos) {
    var points = this.fabricPoly.get("points");
    points.push({
        x: pos.x - this.fabricPoly.get("left"),
        y: pos.y - this.fabricPoly.get("top")
    });
    this.fabricPoly.set({points: points});
};
/*
 * Set coords of the last added point.
 * @point Object with x and y variables
 */
PolygonExtended.prototype.setLastPoint = function (point) {
    var points = this.fabricPoly.get("points");
    points[points.length - 1].x = point.x - this.fabricPoly.get("left");
    points[points.length - 1].y = point.y - this.fabricPoly.get("top");
    this.fabricPoly.set({points: points});
};
/*
 * Set last point position and add one.
 * @pos Object with x and y variables
 */
PolygonExtended.prototype.setAddLastPoint = function (pos) {
    var points = this.fabricPoly.get("points");
    points[points.length - 1].x = pos.x - this.fabricPoly.get("left");
    points[points.length - 1].y = pos.y - this.fabricPoly.get("top");
    points.push({
        x: pos.x - this.fabricPoly.get("left"),
        y: pos.y - this.fabricPoly.get("top")
    });
    this.fabricPoly.set({points: points});
};
/*
 * Remove last real added point, so not tha last one (this is the acutal
 * "pointer" on the board) but the second last one.
 */
PolygonExtended.prototype.removeLastPoint = function () {
    var points = this.fabricPoly.get("points");
    if (points.length > 1) {
        points.splice(points.length-2, 1);
        this.fabricPoly.set({points: points});
    }
};
/*
 * Add circle to the corners for better visibility.
 * @makeCircleCallback function to recall for making the circles
 */
PolygonExtended.prototype.addCornersCircles = function(makeCircleCallback) {
    if (!(makeCircleCallback && typeof(makeCircleCallback) === "function")) {
        console.log("makeCircleCallback function was not properly defined.");
        return;
    }
    var points = this.fabricPoly.get("points");
    var polygonCenter = this.fabricPoly.getCenterPoint();
    for (var i=0; i<points.length; ++i) {
        var x = points[i].x + polygonCenter.x;
        var y = points[i].y + polygonCenter.y;
        this.cornersCircles.push(makeCircleCallback(x, y, 4));
    }
};
/*
 * Remove corners' circles
 */
PolygonExtended.prototype.removeCornersCircles = function(canvas) {
    for (var i=0; i<this.cornersCircles.length; ++i) {
        canvas.remove(this.cornersCircles[i]);
    }
    this.cornersCircles = [];
};
/*
 * Calculate the left-most and top-most points of the polygon.
 * @return Object with left and top points or Null if no points are found.
 */
PolygonExtended.prototype.getLeftAndTopPoints = function () {
    var points = this.fabricPoly.get("points");
    if (points.length == 0) {
        return null;
    }
    var min_left = points[0].x;
    var min_top = points[0].y;
    if (points.length > 1) {
        for (var i=1; i<points.length; ++i) {
            // left
            if (points[i].x < min_left) {
                min_left = points[i].x;
            }
            //top
            if (points[i].y < min_top) {
                min_top = points[i].y;
            }
        }
    }
    return {
        left:   this.fabricPoly.get("minX") + min_left,
        top:    this.fabricPoly.get("minY") + min_top
    };
};
/*
 * Clean the poly and set up on the canvas
 * @makeCircleCallback function Callback for drawing corners' circles
 * @removelast boolean Remove last added point
 *
 * Return errors:
 * 1, everything ok
 * -1, not enough point to define a polygon (min: 2)
 * -2, makeCircleCallback not ok
 */
PolygonExtended.prototype.confirm = function (makeCircleCallback, removelast) {
    var points = this.fabricPoly.get("points");
    // some checks
    if (points.length < 4) {
        return -1;
    }
    if (!(makeCircleCallback && typeof(makeCircleCallback) === "function")) {
        console.log("makeCircleCallback function was not properly defined.");
        return -2;
    }
    // remove last point and add the shape to the canvas
    if (removelast) {
        points.pop();
        this.fabricPoly.set({points: points});
    }
    // place the polygon correctly
    var pos = this.getLeftAndTopPoints();
    this.fabricPoly.set({
        left: pos.left,
        top: pos.top,
        fill: '#222222'
    });
    this.fabricPoly._calcDimensions(false);
    this.fabricPoly.setCoords();
    // add circles
    this.addCornersCircles(makeCircleCallback);
    return 1;
};
/*
 * Calculate the closest corner point to the given one (point) but
 * that can't be too far (max_dist).
 * @point Object with x and y variables
 * @max_dist int for the maximum wanted distance
 * @ret the closest point or a null point
 */
PolygonExtended.prototype.getClosestCornerPoint = function (point, max_dist) {
    var min_dist = max_dist + 1;
    var min_point = null;
    var points = this.fabricPoly.get("points");
    var polygonCenter = this.fabricPoly.getCenterPoint();
    for (var i=0; i<points.length; ++i) {
        var realX = points[i].x+polygonCenter.x;
        var realY = points[i].y+polygonCenter.y;
        var dist = distance(point.x, point.y, realX, realY);
        if (dist < max_dist && dist < min_dist) {
            min_dist = dist;
            min_point = {x:realX, y:realY};
        }
    }
    return {point: min_point, dist: min_dist};
};
/*
 * Calculate the closest point lying on poly's sides to the given one (point) but
 * that can't be too far (max_dist).
 * @point Object with x and y variables
 * @max_dist int for the maximum wanted distance
 * @ret the closest point or a null point
 */
PolygonExtended.prototype.getClosestLinePoint = function (point, max_dist) {
    var points = this.fabricPoly.get("points");
    var len = points.length;
    if (len < 2) {
        return null;
    }
    var min_dist = max_dist + 1;
    var min_point = null;
    var polygonCenter = this.fabricPoly.getCenterPoint();

    for (var i=0; i<len; ++i) {
        var x, y;
        var x1, y1;

        if(i==0) {
            x1 = points[len-1].x + polygonCenter.x;
            y1 = points[len-1].y + polygonCenter.y;
        } else {
            x1 = points[i-1].x + polygonCenter.x;
            y1 = points[i-1].y + polygonCenter.y;
        }
        var x2 = points[i].x + polygonCenter.x;
        var y2 = points[i].y + polygonCenter.y;

        // calculate coefficients of "y = mx + q"
        var deltaX = x2-x1;
        var deltaY = y2-y1;
        if (deltaX == 0) {// special case 1: x1=x2
            x = x1;
            y = point.y;
        } else {
            var m = (deltaY/deltaX);
            if (m == 0) {// special case 2: y1=y2
                x = point.x;
                y = y1;
            } else { // normal case
                var q = (y1-x1*(deltaY/deltaX));
                x = (point.x-(m*(q-point.y)))/(1+(m*m));
                y = m*x + q;
            }
        }

        if(!(isNaN(x) || isNaN(y))) {
            if (isBetween({x:x1,y:y1},{x:x2,y:y2},{x:x,y:y})) {
                var dist = distance(x, y, point.x, point.y);
                if (dist < max_dist && dist < min_dist) {
                    min_dist = dist;
                    min_point = {x:x, y:y};
                }
            }
        }else {
            console.log("JS Error: x and/or y are NaN");
        }
    }
    return {point: min_point, dist: min_dist};
};
/*
 * Remove the polygon and all delegated objects from the canvas.
 */
PolygonExtended.prototype.remove = function (canvas) {
    this.removeCornersCircles(canvas);
    this.removeShutters(canvas);
    canvas.remove(this.fabricPoly);
};
/*
 * Convert some data of this object to a JSON string.
*/
PolygonExtended.prototype.toJson = function () {
    var polygonCenter = this.fabricPoly.getCenterPoint();
    var room = {
        id: this.id,
        name: this.name,
        pos: {
            left: this.fabricPoly.get("left"),
            top: this.fabricPoly.get("top")
        },
        points: this.fabricPoly.get("points").map(function(p) {
                    return {
                        x: polygonCenter.x + p.x,
                        y: polygonCenter.y + p.y
                    };
                }),
        shutters: []
    };
    for (var i=0; i< this.shutters.length; ++i) {
        var shutter = {
            id: this.shutters[i].id,
            angle: this.shutters[i].fabricRect.get("angle"),
            pos:  this.shutters[i].fabricRect.getCenterPoint()
        };
        room.shutters.push(shutter);
    }
    return JSON.stringify(room);
};

/*
 * Save json data into the object.
*/
PolygonExtended.prototype.fromJson = function (json) {
    var room = JSON.parse(json);
    this.id = room.id;
    this.name = room.name;

    this.fabricPoly.set("left", room.pos.left);
    this.fabricPoly.set("top", room.pos.top);
    this.fabricPoly.set({
        points: room.points
    });
    for (var i=0; i< room.shutters.length; ++i) {
        this.addShutter(room.shutters[i].pos, room.shutters[i].id, 0);//room.shutters[i].angle);
    }
};


/* ######### ######### ######### ######### ######### #########
 * RectangleExtended is the extension of the Rectangle object defined
 * by fabricjs. Doing this i can add some useful methods for the app.
 */
function RectangleExtended(pos, id, angle) {
    var w = 20;
    var h = 20;
    this.fabricRect = new fabric.Rect({
        left: pos.x - w/2,
        top: pos.y - h/2,
        width: w,
        height: h,
        angle: angle,
        fill: 'red',
        strokeWidth: 1,
        stroke: '#222222',
        selectable: true,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true
    });
    this.id = id;
}
/*
 * Add a shutter with id (id) to the polygon centered in the given position (pos)
 * and with a certain angle (angle).
*/
PolygonExtended.prototype.addShutter = function(pos, id, angle) {
    if (id == null) {
        this.modified = true;
        id = this.getAvailableShutterID();
    }
    if (angle == null) {
        angle = 0;
    }
    // create a rectangle with angle=45
    var shutter = new RectangleExtended(pos, id, angle);
    this.shutters.push(shutter);
    // add to Html

    return shutter;
};
/*
 * Remove a shutter (index) from the canvas and from the polygon.
*/
PolygonExtended.prototype.removeShutter = function(canvas, index) {
    this.modified = true;
    // remove from canvas and remake the list
    canvas.remove(this.shutters[index].fabricRect);
    this.shutters.splice(index, 1);
};
/*
 * Remove all shutters from canvas and polygon.
*/
PolygonExtended.prototype.removeShutters = function (canvas) {
    this.modified = true;
    for (var i=0; i<this.shutters.length; ++i) {
        canvas.remove(this.shutters[i].fabricRect);
    }
    this.shutters = [];
};
/*
 *  Calculate the first available shutter id based on the max
 *  id of the already present shutters.
*/
PolygonExtended.prototype.getAvailableShutterID = function() {
    var id = -1;
    for (var i=0; i < this.shutters.length; ++i) {
        if (this.shutters[i].id > id) {
            id = this.shutters[i].id;
        }
    }
    return id + 1;
};


/* ## UTILITIES ## */
/*
 *  Check if point c is between a and b
*/
function isBetween(a, b, c){
    var crossproduct = (c.y - a.y) * (b.x - a.x) - (c.x - a.x) * (b.y - a.y);
    if (Math.abs(crossproduct) > 0.2) {return false;}
    var dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y)*(b.y - a.y);
    if (dotproduct < 0) {return false;}
    var squaredlengthba = (b.x - a.x)*(b.x - a.x) + (b.y - a.y)*(b.y - a.y);
    return (dotproduct <= squaredlengthba);
}
/*
 * Calculate the distnace between (x1,y1) and (x2,y2).
*/
function distance(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


/* ## POLYS ## */
/*
 * Calculate the correct position based on grid lines and corners of
 * others poygons.
*/
function processPosition(pos) {
    if (showGridLines) {// follow grid lines
        pos.x = Math.round(pos.x/gridSpaces.x)*gridSpaces.x;
        pos.y = Math.round(pos.y/gridSpaces.y)*gridSpaces.y;
    } else  {// no grid lines
        var closest = getClosestCornerPoint(pos, 20);
        if (closest != null) {// closest
            pos = closest;
        }
    }
    return pos;
}
/**/
function getClosestCornerPoint(point, max_dist) {
    var min_dist = max_dist + 1;
    var min_point = null;
    for (var k=0; k<polys.length; ++k) {
        var p = polys[k].getClosestCornerPoint(point, max_dist);
        if (p.point) {
            if (p.dist < max_dist && p.dist < min_dist) {
                min_dist = p.dist;
                min_point = p.point;
            }
        }
    }
    return min_point;
}
/**/
function getClosestShuttersPoint(point, max_dist) {
    var min_dist = max_dist + 1;
    var min_point = null;
    for (var k=0; k<polys.length; ++k) {
        var p = polys[k].getClosestLinePoint(point, max_dist);
        if (p.point) {
            if (p.dist < max_dist && p.dist < min_dist) {
                min_dist = p.dist;
                min_point = p.point;
                min_point.poly = k;
            }
        }
    }
    return min_point;
}
/*
 *  Calculate the first available room id based on the max
 *  id of the already present rooms.
*/
function getAvailableRoomID() {
    var id = -1;
    for (var i=0; i < polys.length; ++i) {
        if (polys[i].id > id) {
            id = polys[i].id;
        }
    }
    return id + 1;
}
/*
 * Get the index of the given poly if present.
*/
function getIndexOfPoly(poly) {
    if (poly != null) {
        for (var i=0; i<polys.length; ++i) {
            if(polys[i].fabricPoly === poly) {
                return i;
            }
        }
    }
    return polys.length;
}


/* ## MODE ## */
/**/
function changeMode(status) {
    removePointerCircle();
    if (edit) {
        cleanCurrentPoly();
    }
    if (mode != status) {// change
        mode = status;
    } else {// commutate to normal
        mode = 0;
        edit = false;
    }
    $('#mode').html("current mode:"+status);
    checkActiveButton();
}
/**/
function checkActiveButton() {
    for (var i=0; i<modeButtons.length; ++i) {
        if (modeButtons[i] != null) {
            if (mode == i) {
                if (!$(modeButtons[i]).hasClass("active")) {
                    $(modeButtons[i]).addClass("active");
                }
            } else {
                if ($(modeButtons[i]).hasClass("active")) {
                    $(modeButtons[i]).removeClass("active");
                }
            }
        }
    }
}


/* ## CIRCLE ## */
/**/
function removePointerCircle() {
    if (pointerCircle != null) {
        pointerCircle.set({visible:false});
        pointerCircle = null;
        canvas.renderAll();
    }
}
/**/
function makeCircle(left, top, radius) {
    var c = new fabric.Circle({
        left: left,
        top: top,
        radius: radius,
        originX: 'center',
        originY: 'center',
        strokeWidth: 1,
        stroke: '#222222',
        fill: '#cccccc',
        selectable: false
    });
    c.hasControls = c.hasBorders = false;
    return c;
}


/* ## GRID SYSTEM ## */
/**/
function draw_grid() {
    remove_grid();
    for(var i = 1; i < Math.ceil(canvas.width/gridSpaces.x); i++) {
        var h = new fabric.Line(
            [gridSpaces.x*i, 0, gridSpaces.x*i, canvas.height],
            {
                stroke: "rgba(0,0,0,0.3)",
                strokeWidth: 1,
                selectable: false,
                strokeDashArray: dashArray,
                originX: 'center',
                originY: 'center'
            }
        );
        gridLines.push(h);
        canvas.add(h);
    }
    for(i = 1; i < Math.ceil(canvas.height/gridSpaces.y); i++) {
        var v = new fabric.Line(
            [0, gridSpaces.x*i, canvas.width, gridSpaces.x*i],
            {
                stroke: "rgba(0,0,0,0.3)",
                strokeWidth: 1,
                selectable: false,
                strokeDashArray: dashArray,
                originX: 'center',
                originY: 'center'
            }
        );
        gridLines.push(v);
        canvas.add(v);
    }
    canvas.renderAll();
}
/**/
function remove_grid() {
    for (var i = 0; i < gridLines.length; i++) {
        canvas.remove(gridLines[i]);
    }
    gridLines = [];
    canvas.renderAll();
}
/**/
function changeShowGridLines() {
    showGridLines = !showGridLines;
    $('#guidelines').html("showGridLines:"+showGridLines);
    return showGridLines;
}
/**/
function changeGridSpaces(type) {
    if(type=='-') {
        if (gridSpaces.x < 80 ) {
            gridSpaces.x = (gridSpaces.y *= 2);
        }
    } else if(type=='+') {
        if (gridSpaces.x > 20 ) {
            gridSpaces.x = (gridSpaces.y /= 2);
        }
    }
    draw_grid();
}


/* ## POLY MANAGERS ## */
function addPoly(poly) {
    var index = polys.push(poly) - 1;
    addPolyToHtml(index, poly.name);
    return index;
}

function removePoly(num) {
    // save id if it has one
    if (polys[num].id != null) {
        addRemovedRoomToInput(polys[num].id);
    }
    // remove from canvas and remake the list
    polys[num].remove(canvas);
    polys.splice(num, 1);
    rewritePolysListToHtml();
    canvas.renderAll();
}

function cleanCurrentPoly() {
    currentPoly.remove(canvas);
    canvas.renderAll();
    edit=false;
}
function addPolyToHtml(num, name){
    var str =
        '<li class="list-el" id="room'+num+'">' +
        '<div>'+name+'</div>' +
        '<div onclick="removePoly('+num+');" class="item-icon"><i class="mdi-navigation-cancel"></i></div>' +
        '<div onclick="editRoom('+num+');" class="item-icon"><i class="mdi-content-create"></i></div>' +
        '</li>';
    $('#rooms-list').append(str);
}

function rewritePolysListToHtml() {
    $('#rooms-list').empty();
    for (var i = 0; i < polys.length; ++i) {
        addPolyToHtml(i, polys[i].name);
    }
}

function editRoom(index) {
    if (canvas.getActiveObject()!==polys[index].fabricPoly) {
        canvas.setActiveObject(polys[index].fabricPoly);
    }
    currentEdit = index;
    $('#rooms-list .active').removeClass("active");
    $('#room'+index).addClass("active");
    $("#room-name").removeAttr('placeholder');
    $("input[name='room-name']").val(polys[index].name);
    $('#room-edit .panel-body').show();
}

function removeEditRoom(){
    currentEdit = null;
    $('#rooms-list .active').removeClass("active");
    $("#room-name").attr('placeholder', 'Room\'s name');
    $("input[name='room-name']").val("");
    $('#room-edit .panel-body').hide();
}

function confirmName() {
    polys[currentEdit].name = $("input[name='room-name']").val();
    polys[currentEdit].modified = true;
    rewritePolysListToHtml();
}
/*
function cancelName() {
    $("input[name='room-name']").val(polys[currentEdit].name);
}
*/


/* ## SHUTTER MANAGERS ## */
function removeShutter(indexPoly, indexShutter) {
    polys[indexPoly].removeShutter(canvas, indexShutter);
    canvas.renderAll();
    refreshShuttersList(indexPoly);
}

function refreshShuttersList(index){
    $('#shutters-list').empty();
    var shutters = polys[index].shutters;
    for (var i=0; i<shutters.length; ++i) {
        var str =
            '<li class="list-el" id="shutter'+i+'">' +
            '<div>Shutter'+shutters[i].id+'</div>' +
            '<div onclick="removeShutter('+index+','+i+');" class="item-icon"><i class="mdi-navigation-cancel"></i></div>' +
            '</li>';
        $('#shutters-list').append(str);
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

function clearShuttersList() {
    $('#shutters-list').empty();
}


/* ## SAVE CANVAS ## */
function saveCanvas() {//TODO
    saveRoomsDataToForm();
    alert("done");
}

function saveRoomsDataToForm() {
    for (var i =0; i<polys.length; ++i) {
        if (polys[i].new) {// new room
            addNewRoomToInput(i);
        } else {// already added room
            if (polys[i].modified) {
                addModifiedRoomToInput(i);
            }
        }
    }
}

function addRemovedRoomToInput(id) {
    var val = $('[name=roomsRemoved]').val();
    if (val == "") {
        $('[name=roomsRemoved]').val(id);
    } else {
        $('[name=roomsRemoved]').val(val+','+id);
    }
}

function addModifiedRoomToInput(indexPoly) {
    // add id to the input
    var id = polys[indexPoly].id;
    var val = $('[name=roomsModified]').val();
    if (val == "") {
        $('[name=roomsModified]').val(id);
    } else {
        $('[name=roomsModified]').val(val+','+id);
    }
    // add inputs for the room's data
    var jsondata = polys[indexPoly].toJson();
    $('#canvasForm').append('<input type="hidden" name="modRoomData'+id+'" value=\''+jsondata+'\' />');
}

function addNewRoomToInput(indexPoly) {
    // add id to the input
    var id = polys[indexPoly].id;
    var val = $('[name=roomsAdded]').val();
    if (val == "") {
        $('[name=roomsAdded]').val(id);
    } else {
        $('[name=roomsAdded]').val(val+','+id);
    }
    // add inputs for the room's data
    var jsondata = polys[indexPoly].toJson();
    $('#canvasForm').append('<input type="hidden" name="addRoomData'+id+'" value=\''+jsondata+'\' />');
}

function resetCanvas() {// TODO
    console.log(0);
}


/* ## LOAD CANVAS ## */
function drawRoomFromJson(json){
    // load room
    var poly = new PolygonExtended({x:0, y:0}, 0, "room0");
    poly.fromJson(json);
    poly.confirm(function(x, y){
        var c = makeCircle(x, y, 4);
        canvas.add(c);
        return c;
    }, false);
    addPoly(poly);
    canvas.add(poly.fabricPoly);
    // load shutters
    for (var i=0; i<poly.shutters.length; ++i) {
        canvas.add(poly.shutters[i].fabricRect);
    }
    canvas.renderAll();
}


/* ## TODO: TO REMOVE ## */
/*
function drawSomePolygons() {
    var startX = 10;
    var startY = 10;
    var w = 40;
    var h = 40;
    var dx = 60;
    for(var i=0; i<8; ++i) {
        var poly = new PolygonExtended({x:startX+dx*i, y:startY}, i, "room"+i);
        poly.addPoint({x:startX+w+dx*i, y:startY});
        poly.addPoint({x:startX+dx*i, y:startY+h});
        poly.addPoint({x:startX+w+dx*i, y:startY+h});
        poly.confirm(function(x, y){
            var c = makeCircle(x, y, 4);
            canvas.add(c);
            return c;
        }, false);
        addPoly(poly);
        canvas.add(poly.fabricPoly);
    }
    canvas.renderAll();
}

function drawBigCenterPoly() {
    var startX = 200;
    var startY = 200;
    var w = 100;
    var h = 100;
    var poly = new PolygonExtended({x:startX, y:startY}, 0, "room0");
    poly.setAddLastPoint({x:startX+w, y:startY});
    poly.setAddLastPoint({x:startX+w, y:startY+h});
    poly.setAddLastPoint({x:startX, y:startY+h});
    poly.confirm(function(x, y){
        var c = makeCircle(x, y, 4);
        canvas.add(c);
        return c;
    }, true);
    addPoly(poly);
    canvas.add(poly.fabricPoly);
    canvas.renderAll();
}
*/

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
            // TODO: change shape for the shutter's pointer
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
        var pos = canvas.getPointer(event.e);
        var realPos = {};
        if (mode == 1) {// add/edit room
            realPos = processPosition(pos);
            if (edit) {// edit polygon
                currentPoly.addPoint(realPos);
            } else {// add polygon
                currentPoly = new PolygonExtended(realPos, null, "New room");
                canvas.add(currentPoly.fabricPoly);
                edit = true;
            }

        } else if (mode==2) {//remove poly
            var obj = canvas.getActiveObject();
            if (obj instanceof fabric.Polygon) {
                var indexPoly = getIndexOfPoly(obj);
                if (indexPoly != polys.length) {
                    removePoly(indexPoly);
                    clearShuttersList();
                }
            }

        } else if (mode==5) {// add shutter

            var closest = getClosestShuttersPoint(pos, 30);
            if (closest != null) {
                realPos.x = closest.x;
                realPos.y = closest.y;
                var polyIndex = closest.poly;
                var shutter = polys[polyIndex].addShutter(realPos, null);
                canvas.add(shutter.fabricRect);
                editRoom(polyIndex);
                canvas.setActiveObject(shutter.fabricRect);
                refreshShuttersList(polyIndex);
            }
        } else if (mode==6) {//remove shutter
            var obj = canvas.getActiveObject();
            if (obj instanceof fabric.Rect) {
                var indexes = getIndexOfShutter(obj);
                if (indexes.poly != polys.length) {
                    removeShutter(indexes.poly, indexes.shutter);
                    editRoom(indexes.poly);
                }
            }
        }
        canvas.renderAll();
    });

    canvas.observe("object:selected", function(event) {
        var index;
        if (mode < 5) {// rooms
            index = getIndexOfPoly(canvas.getActiveObject());
            if (index != polys.length) {
                if (mode == 2) { // remove poly
                    removePoly(index);
                    clearShuttersList();
                } else {
                    editRoom(index);
                    refreshShuttersList(index);
                }
            }
        } else {// shutters
            index = getIndexOfShutter(canvas.getActiveObject());
            if (index.poly != polys.length) {
                if (mode == 6) { // remove shutter
                    removeShutter(index.poly, index.shutter);
                    editRoom(index.poly);
                }
            }
        }
    });

    canvas.observe("selection:cleared", function(event) {
        if (mode < 5) {// rooms
            removeEditRoom();
            clearShuttersList()
        }
    });

    fabric.util.addListener(window, 'keyup', function (e) {
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
                    editRoom(i);
                    edit = false;
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
            if (changeShowGridLines()) {
                draw_grid();
            } else {
                remove_grid();
            }
        } else if (e.keyCode == 107 || e.keyCode == 187) {// + numpad or + keyboard
            changeGridSpaces('+');
        } else if (e.keyCode == 109 || e.keyCode == 189) {// - numpad or - keyboard
            changeGridSpaces('-');
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
                    removeShutter(index.poly, index.shutter);
                    editRoom(index.poly);
                }
            }
        }
    });
})();

