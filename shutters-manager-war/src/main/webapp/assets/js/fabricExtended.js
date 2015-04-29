/**
 * Created by kalu on 07/03/15.
 *
 */
// adjust canvas width
$('#fabric').attr('width', $('#fabric').parent().width());


/*
 *  SETTINGS
 */
var settings = {
    useShortcuts: false,
    useMouseClick: false,
    useMode: false
};
function setSettings(s) {
    for (var p in s) {
        if (s.hasOwnProperty(p) && settings.hasOwnProperty(p)) {
            settings[p] = s[p];
        }
    }
}


var canvas = new fabric.Canvas('fabric');
canvas.tabIndex = 1000;
canvas.selection = false;

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
/** @type {Array.<PolygonExtended>} */
var polys = [];
var currentEdit = null;
var currentPoly = null;

/* Save Canvas */
var countRemoved = 0;

/* Long Click */
var longClickPolyTimeout;
var longClickPoly = false;

/* Grid Lines */
var currentGridIndex = 0;
var gridLines       = [];
var gridSpaces      = [{x:20, y:20},{x:30, y:30},{x:40, y:40},{x:60, y:60}];
var dashArray       = [5, 5];
var showGridLines   = true;
var lockGrid        = true;

/** ######### ######### ######### ######### ######### #########
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
        opacity: 0.75,
        selectable: true,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true
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
    this.fabricText = new fabric.Text(name, {
        fill: 'white',
        fontSize: 16,
        hasControls: false,
        hasBorders: false,
        selectable: true,
        lockMovementX: true,
        lockMovementY: true
    });

    // arrays
    this.cornersCircles = [];
    /** @type {Array.<RectangleExtended>} */
    this.shutters = [];
    this.shuttersRemoved = [];
}
/**
 * Create the new overlay name of this room.
 * @param name String new name to set
 * @param init if this is the initial set of the name
 */
PolygonExtended.prototype.setName = function (name, init) {
    if (!init) {this.modified=true;}
    this.name=name;
    this.fabricText.setText(this.name);
    this.adjustNameLines();
    this.adjustNamePosition();
};
/**
 * Put some '\n' if the text is out of poly's bounds.
 */
PolygonExtended.prototype.adjustNameLines = function () {
    var len = this.name.length;
    var delta = 10; // px to subtract to actual Poly's width so lines are not close to bounds
    var ratio = this.fabricText.getBoundingRectWidth()/(this.fabricPoly.getBoundingRectWidth()-delta);
    var numOfCharsPerLine = Math.floor(len/ratio);
    var i = 0;
    var str="";
    while (i<len) {
        if (i+numOfCharsPerLine>=len) { // last line
            str += this.name.substr(i, len-i);
        } else { // all others
            str += this.name.substr(i, numOfCharsPerLine) + String('\n');
        }
        i += numOfCharsPerLine;
    }
    this.fabricText.setText(str);
};

/**
 * Correctly align the text after it has been added to the canvas.
 */
PolygonExtended.prototype.adjustNamePosition = function () {
    this.fabricText.set("left", this.fabricPoly.get("left") + this.fabricPoly.getBoundingRectWidth() / 2 - this.fabricText.getBoundingRectWidth() / 2);
    this.fabricText.set("top", this.fabricPoly.get("top") + this.fabricPoly.getBoundingRectHeight() / 2 - this.fabricText.getBoundingRectHeight() / 2);
};
/**
 * Add a point to the polygon.
 * @param pos Object with x and y variables
 */
PolygonExtended.prototype.addPoint = function (pos) {
    var points = this.fabricPoly.get("points");
    points.push({
        x: Math.round(pos.x - this.fabricPoly.get("left")),
        y: Math.round(pos.y - this.fabricPoly.get("top"))
    });
    this.fabricPoly.set({points: points});
};
/**
 * Get integer central point.
 */
PolygonExtended.prototype.getIntCenterPoint = function () {
    var pc = this.fabricPoly.getCenterPoint();
    return {'x':Math.round(pc.x), 'y':Math.round(pc.y)};
};
/**
 * Set coords of points.
 * @points Object with x and y variables

 PolygonExtended.prototype.logPoints = function () {
    var polygonCenter = this.getIntCenterPoint();
    var points = this.fabricPoly.get("points");
    for(var i=0; i < points.length; ++i) {
        console.log("->point "+i+", x:"+points[i].x+" y:"+points[i].y);
    }
    console.log("->point "+i+", l:"+polygonCenter.x+" t:"+polygonCenter.y);
    //this.fabricPoly.set({points: points});
}; */
/**
 * Set coords of the last added point.
 * @point Object with x and y variables
 */
PolygonExtended.prototype.setLastPoint = function (point) {
    var points = this.fabricPoly.get("points");
    points[points.length - 1].x = Math.round(point.x - this.fabricPoly.get("left"));
    points[points.length - 1].y = Math.round(point.y - this.fabricPoly.get("top"));
    this.fabricPoly.set({points: points});
};
/**
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
/**
 * Add circle to the corners for better visibility.
 * @makeCircleCallback function to recall for making the circles
 */
PolygonExtended.prototype.addCornersCircles = function(makeCircleCallback) {
    if (!(makeCircleCallback && typeof(makeCircleCallback) === "function")) {
        console.log("makeCircleCallback function was not properly defined.");
        return;
    }
    var points = this.fabricPoly.get("points");
    var polygonCenter = this.getIntCenterPoint();
    for (var i=0; i<points.length; ++i) {
        var x = Math.round(points[i].x + polygonCenter.x);
        var y = Math.round(points[i].y + polygonCenter.y);
        this.cornersCircles.push(makeCircleCallback(x, y, 4));
    }
};
/**
 * Remove corners' circles
 */
PolygonExtended.prototype.removeCornersCircles = function(canvas) {
    for (var i=0; i<this.cornersCircles.length; ++i) {
        canvas.remove(this.cornersCircles[i]);
    }
    this.cornersCircles = [];
};
/**
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
    var strokeCorrection = 0;
    // remove last point and add the shape to the canvas
    if (removelast) {
        points.pop();
        strokeCorrection = this.fabricPoly.get("strokeWidth")/2;
    }
    // some checks
    if (points.length < 3) {
        return -1;
    }
    if (!(makeCircleCallback && typeof(makeCircleCallback) === "function")) {
        console.log("makeCircleCallback function was not properly defined.");
        return -2;
    }
    // call helpers
    this.fabricPoly._calcDimensions(false);
    this.fabricPoly.setCoords();

    // place the polygon correctly
    var minx = this.fabricPoly.get("minX");
    var miny = this.fabricPoly.get("minY");
    var l = Math.round(this.fabricPoly.get("left") + minx);
    var t = Math.round(this.fabricPoly.get("top") + miny);
    this.fabricPoly.set({
        left: l,
        top: t
    });
    this.changeFillColor(false);

    // adjust points's positions
    var pCenter = this.getIntCenterPoint();
    var adjPoints = points.map(function(p) {
        return {
            x: Math.round(p.x - pCenter.x + l - minx),
            y: Math.round(p.y - pCenter.y + t - miny)
        };
    });
    this.fabricPoly.set({points: adjPoints});

    // add circles
    this.addCornersCircles(makeCircleCallback);

    // add text
    this.setName(this.name, true);
    return 1;
};
/**
 * Change the fill color of the polygon
 * @param sel Selected obj or not
 */
PolygonExtended.prototype.changeFillColor = function(sel) {
    if (sel) { this.fabricPoly.set({fill: '#ff6f00'}); }
    else { this.fabricPoly.set({fill: '#0277bd'}); }
    canvas.renderAll();
};
/**
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
    var polygonCenter = this.getIntCenterPoint();
    for (var i=0; i<points.length; ++i) {
        var realX = Math.round(points[i].x+polygonCenter.x);
        var realY = Math.round(points[i].y+polygonCenter.y);
        var dist = distance(point.x, point.y, realX, realY);
        if (dist < max_dist && dist < min_dist) {
            min_dist = dist;
            min_point = {x:realX, y:realY};
        }
    }
    return {point: min_point, dist: min_dist};
};
/**
 * Calculate the closest point lying on poly's sides to the given one (point) but
 * that can't be too far (max_dist).
 * @param point Object with x and y variables
 * @param max_dist int for the maximum wanted distance
 * @return Object the closest point or a null point
 */
PolygonExtended.prototype.getClosestLinePoint = function (point, max_dist) {
    var points = this.fabricPoly.get("points");
    var len = points.length;
    if (len < 2) {
        return null;
    }
    var min_dist = max_dist + 1;
    var min_point = null;
    var polygonCenter = this.getIntCenterPoint();

    for (var i=0; i<len; ++i) {
        var x, y;
        var x1, y1;

        if(i==0) {
            x1 = Math.round(points[len-1].x + polygonCenter.x);
            y1 = Math.round(points[len-1].y + polygonCenter.y);
        } else {
            x1 = Math.round(points[i-1].x + polygonCenter.x);
            y1 = Math.round(points[i-1].y + polygonCenter.y);
        }
        var x2 = Math.round(points[i].x + polygonCenter.x);
        var y2 = Math.round(points[i].y + polygonCenter.y);

        // calculate coefficients of "y = mx + q"
        var deltaX = x2-x1, deltaY = y2-y1;
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
/**
 * Remove the polygon and all delegated objects from the canvas.
 */
PolygonExtended.prototype.remove = function (canvas) {
    this.removeCornersCircles(canvas);
    this.removeShutters(canvas);
    canvas.remove(this.fabricText);
    canvas.remove(this.fabricPoly);
};
/**
 * Convert some data of this object to a JSON string.
 */
PolygonExtended.prototype.toJson = function () {
    var c = this.getIntCenterPoint();
    var strokeCorrection = this.fabricPoly.get("strokeWidth")/2;
    var room = {
        id: this.id,
        name: this.name,
        pos: {
            left: Math.round(c.x - strokeCorrection),
            top: Math.round(c.y - strokeCorrection)
        },
        points: this.fabricPoly.get("points").map(function(p) {
            return {
                x: Math.round(p.x),
                y: Math.round(p.y)
            };
        }),
        shutters: [],
        removedShutters: this.shuttersRemoved
    };
    strokeCorrection = Math.round(1/2); //TODO: change with RectangleEntende strokeWidth
    for (var i=0; i< this.shutters.length; ++i) {
        c = this.shutters[i].getIntCenterPoint();
        var shutter = {
            id: this.shutters[i].id,
            angle: this.shutters[i].fabricRect.get("angle"),
            pos: {
                x: Math.round(c.x - strokeCorrection),
                y: Math.round(c.y - strokeCorrection)
            },
            news: this.shutters[i].news
        };
        room.shutters.push(shutter);
    }
    return JSON.stringify(room);
};

/**
 * Set given data. (called after parsing the canvas json)
 */
PolygonExtended.prototype.setData = function (roomData) {
    this.id = roomData.id;
    this.name = roomData.name;

    this.fabricPoly.set("left", roomData.pos.left);
    this.fabricPoly.set("top", roomData.pos.top);
    this.fabricPoly.set({
        points: roomData.points
    });
    for (var i=0; i< roomData.shutters.length; ++i) {
        this.addShutter(roomData.shutters[i].pos, roomData.shutters[i].id, 0, false);//room.shutters[i].angle, false);
    }
};



/** ######### ######### ######### ######### ######### #########
 * RectangleExtended is the extension of the Rectangle object defined
 * by fabricjs. Doing this i can add some useful methods for the app.
 */
function RectangleExtended(pos, id, angle, news) {
    var w = 20;
    var h = 20;
    this.fabricRect = new fabric.Rect({
        left: Math.round(pos.x - w/2),
        top: Math.round(pos.y - h/2),
        width: w,
        height: h,
        angle: angle,
        fill: '#e0e0e0',
        opacity: 0.8,
        strokeWidth: 1,
        stroke: '#004d40',
        selectable: true,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true
    });
    this.news=news;
    this.id = id;
}
/**
 * Get integer central point.
 */
RectangleExtended.prototype.getIntCenterPoint = function () {
    var pc = this.fabricRect.getCenterPoint();
    return {'x':Math.round(pc.x), 'y':Math.round(pc.y)};
};
/**
 * Add a shutter with id (id) to the polygon centered in the given position (pos)
 * and with a certain angle (angle).
 */
PolygonExtended.prototype.addShutter = function(pos, id, angle, news) {
    if (id == null) {
        this.modified = true;
        id = this.getAvailableShutterID();
    }
    if (angle == null) {angle = 0;}
    if (news == null) {news=true;}
    // create a rectangle with angle=45
    var shutter = new RectangleExtended(pos, id, angle, news);
    this.shutters.push(shutter);

    return shutter;
};
/**
 * Remove a shutter (index) from the canvas and from the polygon.
 */
PolygonExtended.prototype.removeShutter = function(canvas, index) {
    this.modified = true;
    this.shuttersRemoved.push(this.shutters[index].id);
    // remove from canvas and remake the list
    canvas.remove(this.shutters[index].fabricRect);
    this.shutters.splice(index, 1);
};
/**
 * Remove all shutters from canvas and polygon.
 */
PolygonExtended.prototype.removeShutters = function (canvas) {
    this.modified = true;
    for (var i=0; i<this.shutters.length; ++i) {
        this.shuttersRemoved.push(this.shutters[i].id);
        canvas.remove(this.shutters[i].fabricRect);
    }
    this.shutters = [];
};
/**
 *  Calculate the first available shutter id based on the max
 *  id of the already present shutters.
 */
PolygonExtended.prototype.getAvailableShutterID = function() {
    var id = 0;
    for (var i=0; i < this.shutters.length; ++i) {
        if (this.shutters[i].id > id) {
            id = this.shutters[i].id;
        }
    }
    return id + 1;
};
/**
 * Change the fill color of the shutter
 * @param selShutt s
 * @param selRoom s
 */
RectangleExtended.prototype.changeFillColor = function(selShutt, selRoom) {
    if (selShutt) {
        this.fabricRect.set({fill: '#64dd17'});
    } else {
        if (selRoom) {
            this.fabricRect.set({fill: '#43a047'});
        } else {
            this.fabricRect.set({fill: '#e0e0e0'});
        }
    }
    canvas.renderAll();
};


/* ## UTILITIES ## */
/**
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
/**
 * Calculate the distnace between (x1,y1) and (x2,y2).
 */
function distance(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


/* ## POLYS ## */
/**
 * Calculate the correct position based on grid lines and corners of
 * others poygons.
 */
function processPosition(pos) {
    if (lockGrid && showGridLines) {// follow grid lines
        pos.x = Math.round(pos.x/gridSpaces[currentGridIndex].x)*gridSpaces[currentGridIndex].x;
        pos.y = Math.round(pos.y/gridSpaces[currentGridIndex].y)*gridSpaces[currentGridIndex].y;
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
    var id = 0;
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
/*
 * Get the poly's index of the given text.
 */
function getIndexOfPolyByText(text) {
    if (text != null) {
        for (var i=0; i<polys.length; ++i) {
            if(polys[i].fabricText === text) {
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
    var g = gridSpaces[currentGridIndex];
    for(var i = 1; i < Math.ceil(canvas.width/g.x); i++) {
        var h = new fabric.Line(
            [g.x*i, 0, g.x*i, canvas.height],
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
    for(i = 1; i < Math.ceil(canvas.height/g.y); i++) {
        var v = new fabric.Line(
            [0, g.x*i, canvas.width, g.x*i],
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
function toggleShowGridLines() {
    showGridLines = !showGridLines;
    if (showGridLines) {draw_grid();}
    else {remove_grid();}
    return showGridLines;
}
function changeShowGrid(val) {
    showGridLines = val;
    if (showGridLines) {draw_grid();}
    else {remove_grid();}
    return showGridLines;
}
/**/
function zoomGridSpaces(type) {
    if (showGridLines) {
        type == '-' ? currentGridIndex-- : currentGridIndex++;
        if (currentGridIndex==-1) {currentGridIndex++}
        else if (currentGridIndex==gridSpaces.length) {currentGridIndex--;}
        draw_grid();
    }
}
function changeGridSpaces(index) {
    if (showGridLines) {
        currentGridIndex = index;
        draw_grid();
    }
}
/**/
function changeLockGrid(val) {
    lockGrid = val;
}


/* ## LOAD CANVAS ## */
function drawRoomFromJson(roomData){
    // load room's data
    var poly = new PolygonExtended({x:0, y:0}, 0, "room0");
    poly.setData(roomData);
    poly.confirm(function(x, y){
        var c = makeCircle(x, y, 4);
        canvas.add(c);
        return c;
    }, false);
    addPoly(poly);
    // update canvass
    canvas.add(poly.fabricPoly);
    canvas.add(poly.fabricText);
    for (var i=0; i<poly.shutters.length; ++i) {
        canvas.add(poly.shutters[i].fabricRect);
    }
    canvas.renderAll();
}