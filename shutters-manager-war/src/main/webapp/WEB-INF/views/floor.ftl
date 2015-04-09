<#-- Some checks -->
<#if !message??>
    <#assign message="ERROR: value for 'message' not passed to the template."/>
</#if>
<#if !userNick??>
    <#assign userNick="ERROR: value for 'userNick' not passed to the template."/>
</#if>
<#if !userEmail??>
    <#assign userEmail="ERROR: value for 'userEmail' not passed to the template."/>
</#if>
<#if !logoutURL??>
    <#assign logoutURL="ERROR: value for 'logourURL' not passed to the template."/>
</#if>
<#if !floor??>
    <#assign floor=[]/>
</#if>
<#if !error??>
    <#assign error=""/>
</#if>

<#-- Import and display -->
<#import "layout/baseLayout.ftl" as layout>
<@layout.mainLayout userNick userEmail logoutURL>
    <div class="row">
        <div class="xl12">
            <h4 class="amber-text center">Draw Floor Layout</h4>
                <!-- Keyboard Shortcuts
                <div class="row">
                    <div class="col m6 offset-l3 offset-m3 hidden-s">
                        <div class="card" id="keyboard-shortcut-card">
                            <div class="card-content black-text">
                                <span class="card-title">Keyboard Shortcuts</span>
                                <p class="flow-text">
                                    Become a Pro using these Keyboard Shortcuts!
                                    <ul>
                                        <li><div class="teal-text">ESC</div>Toggle "add room" and Save room while adding one.</li>
                                        <li><div class="teal-text">Q</div>Toggle "show grid".</li>
                                        <li><div class="teal-text">+/-</div>Zoom in and out the grid.</li>
                                        <li><div class="teal-text">X</div>Remove last added point while adding a room.</li>
                                        <li><div class="teal-text">Canc</div>Remove the selected object.</li>
                                    </ul>
                                </p>
                            </div>
                            <div class="card-action row buttons-row">
                                <a class="btn teal white-text waves-effect waves-light right" onclick="$('#keyboard-shortcut-card').fadeOut()">Got it!</a>
                            </div>
                        </div>
                    </div>
                </div>
                -->
                <!--
                <div class="row">
                    <!-- Tools of rooms ->
                    <div class="col l7 m7 s7 left">
                        <div class="col l4 m6 s12">
                            <p>Manage rooms</p>
                            <div>
                                <div class="item-icon" id="addRoom">
                                    <i class="mdi-content-add-circle-outline"></i>
                                    <h6 class="nomargin"><small>New Room</small></h6>
                                </div>
                                <div class="item-icon" id="undoLastPoint">
                                    <i class="mdi-content-undo"></i>
                                    <h6 class="nomargin"><small>Undo</small></h6>
                                </div>
                                <div class="item-icon" id="removeRoom">
                                    <i class="mdi-content-remove-circle-outline"></i>
                                    <h6 class="nomargin"><small>Delete Room</small></h6>
                                </div>
                                <br class="brclear" />
                            </div>
                        </div>
                        <!-- Tools of shutters ->
                        <div class="col l4 m6 s12">
                            <p>Manage shutters</p>
                            <div class="item-icon" id="addShutter">
                                <i class="mdi-content-add-circle-outline"></i>
                                <h6 class="nomargin"><small>New Shutter</small></h6>
                            </div>
                            <div class="item-icon" id="removeShutter">
                                <i class="mdi-content-remove-circle-outline"></i>
                                <h6 class="nomargin"><small>Remove Shutter</small></h6>
                            </div>
                        </div>

                        <!-- Drawing area utilities ->

                        <div class="col l4 m6 offset-m3 hidden-s">
                            <p>Drawing area utilities</p>
                            <div class="switch">
                                <h6 class="nomargin"><small>Show grid</small></h6>
                                <label>
                                    Off
                                    <input type="checkbox" id="showGrid">
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>
                            <div class="switch">
                                <h6 class="nomargin"><small>Lock points on grid</small></h6>
                                <label>
                                    Off
                                    <input type="checkbox" id="lockGrid">
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>
                            <div class="switch">
                                <h6 class="nomargin"><small>Zoom grid</small></h6>
                                <p class="range-field">
                                    <input type="range" id="zoomGrid" min="0" max="2" />
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- List of rooms ->
                    <div class="col l5 m5 s5 right">
                        <h5>Rooms list</h5>
                        <div class="row">
                            <ul id="rooms-list" class="collapsible" data-collapsible="accordion"></ul>
                        </div>
                    </div>
                </div>
                -->

                <!-- Canvas ->
                <div class="row">
                        <div class="canvas col l12 m12 s12">
                            <h5>Plant Drawing Area</h5>
                            <canvas id="fabric" height="500" class="z-depth-1"></canvas>
                        </div>

                    <!-- Hidden form and buttons ->
                    <div class="col s12">
                        <form name="canvasForm" method="POST" id="canvasForm">
                            <input type="hidden" name="roomsRemoved" value="">
                            <input type="hidden" name="roomsModified" value="">
                            <input type="hidden" name="roomsAdded" value="">
                        </form>

                        <div class="buttons-row">
                            <a href="javascript:resetCanvas();" class="btn btn-warning btn-raised">Reset changes</a>
                            <a href="javascript:saveCanvas();" class="btn btn-success btn-raised">Save!</a>
                        </div>
                    </div>
                </div>
                -->

            <!-- This is necessary to create fancy alignment -->
            <div class="col l10 offset-l1 m10 offset-m1 s10 offset-s1">
                <h5>Plant Drawing Area</h5>
            </div>


            <div class="canvas col l10 offset-l1 m10 offset-m1 s10 offset-s1 left">
                    <canvas id="fabric" height="500" class="z-depth-1"></canvas>
                </div>

                <div class="col l1 m1 s1 right right-align" style="height: 500px; margin-bottom: 10px; position: relative">
                    <div class="fab-container" style="position: absolute; bottom: 0; heigth: 200px">
                        <a id="fancy-fab" class="btn-floating btn-large waves-effect waves-light red" ><i class="mdi-content-add"></i></a>
                    </div>
                </div>

                <!-- Hidden form and buttons ->
                <div class="col s12">
                    <form name="canvasForm" method="POST" id="canvasForm">
                        <input type="hidden" name="roomsRemoved" value="">
                        <input type="hidden" name="roomsModified" value="">
                        <input type="hidden" name="roomsAdded" value="">
                    </form>

                    <div class="buttons-row">
                        <a href="javascript:resetCanvas();" class="btn btn-warning btn-raised">Reset changes</a>
                        <a href="javascript:saveCanvas();" class="btn btn-success btn-raised">Save!</a>
                    </div>
                </div>
                -->
        </div>




        <!-- Remove Home Confirm Modal -->
        <div id="confirmModal" class="modal">
            <div class="modal-content">
                <h4>Confirm house deleting..</h4>
                <p>You are removing a floor along with all rooms and shutters associated! You won't be able to undo that.</p>
            </div>
            <div class="modal-footer">
                <a class="modal-action modal-close waves-effect waves-green btn-flat" id="agreeRemove">
                    Agree&nbsp;<i class="mdi-navigation-check green-text"></i>
                </a>
                <a href="#" class="modal-action modal-close waves-effect waves-red btn-flat" id="disagreeRemove">
                    Disagree&nbsp;<i class="mdi-navigation-close red-text"></i>
                </a>
            </div>
        </div>
    </div>

<script type="text/javascript" src="/assets/js/fabric.min.js"></script>
<script type="text/javascript" src="/assets/js/canvasManager.js"></script>
<script type="text/javascript" src="/assets/js/floorManager.js"></script>
<script type="text/javascript" src="/assets/js/responsiveFloatingActionButton.js"></script>

<script>
    $(document).ready(function() {
        // This command is used to initialize some elements and make them work properly
        //$.material.init();

        /*var str='';
        drawRoomFromJson(str);
        str='';
        drawRoomFromJson(str);*/
        //$('.collapsible').collapsible();
        changeMode(0);

        /*Bind tools' buttons to events*/
        $('#addRoom').on('click', function() {changeMode(1);});
        $('#removeRoom').on('click', function() {changeMode(2);});
        $('#addShutter').on('click', function() {changeMode(5);});
        $('#removeShutter').on('click', function() {changeMode(6);});
        $('#undoLastPoint').on('click', function() {
            if (currentPoly) {
                currentPoly.removeLastPoint();
            }
            canvas.renderAll();
        });

        // TODO: when keyboard buttons pressed change visualization
        $('#showGrid').on('click', function() {
            changeShowGrid($(this).prop('checked'));
        });
        $('#lockGrid').on('click', function() {
            changeLockGrid($(this).prop('checked'));
        });
        $('#zoomGrid').on('change', function() {
            changeGridSpaces($(this).val());
        });

        // rooms-list
        var sel = $('#rooms-list');
        sel.on('click', '.collapsible-header', function() {
            editRoom(parseInt($(this).attr('data-toggle')), true);
        });
        sel.find('input[name="room-name"]').keypress(function (e) {
            if (e.which == 13) {
                confirmName();
            }
        });

    });
</script>
</@layout.mainLayout>
