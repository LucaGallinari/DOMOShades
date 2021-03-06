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
<#if !home??>
    <#assign home=""/>
</#if>
<#if !homes??>
    <#assign homes=""/>
</#if>
<#if !floor??>
    <#assign floor=""/>
</#if>
<#if !floors??>
    <#assign floors=""/>
</#if>
<#if !rooms??>
    <#assign rooms=[]/>
</#if>
<#if !windows??>
    <#assign windows=[]/>
</#if>
<#if !error??>
    <#assign error=""/>
</#if>

<#-- Import and display -->
<#import "layout/baseLayout.ftl" as layout>
<@layout.mainLayout userNick userEmail logoutURL homes floors>

    <!-- Breadcrumb -->
    <div class="row">
        <div class="col s12 left">
            <p class="breadcrumb">
                <span><a href="/homes/" class="tooltipped" data-position="bottom" data-tooltip="List of your houses">Homes</a></span>
                <span><a href="/floors/?home=${home}" class="tooltipped" data-position="bottom" data-tooltip="List of your floors">Floors</a></span>
                <span>Rules</span>
            </p>
        </div>
    </div>

    <div class="container">

        <!-- Canvas -->
        <div class="row">
            <div class="row">
                <h4 class="col s12 deep-orange-text">Manage Floor Rules</h4>
            </div>

            <div class="canvas">
                <canvas id="fabric" height="500"></canvas>
            </div>
        </div>
        <!-- END Canvas -->

        <div class="col s12"><br><br></div>

        <!-- Rules table -->
        <div class="row card" id="rulesArea">
            <div class="col s12" style="position: relative;">
                <div class="transp-overlay">&nbsp;</div>
                <ul class="tabs">
                    <li class="tab col s4"><a class="active" href="#floorRules"><i class="mdi-maps-layers prefix"></i>&nbsp;&nbsp;Floor Rules</a></li>
                    <li class="tab col s4"><a href="#roomRules"><i class="mdi-navigation-apps prefix"></i>&nbsp;&nbsp;Room Rules</a></li>
                    <li class="tab col s4"><a href="#windowRules"><i class="mdi-image-crop-portrait prefix"></i>&nbsp;&nbsp;Window Rules</a></li>
                </ul>
            </div>
            <div id="floorRules" class="col s12">
                <div class="red-text hidden center flow-text" id="noFloorRules" style="margin-top: 20px;">There are no rules for this floor.<br />Add one using the button below</div>
                <div class="row rules-list"></div>
                <div class="row rules-timetable" style="position:relative;"></div>
                <div class="row buttons-row">
                    <div class="switch left">
                        <label>
                            List
                            <input type="checkbox" name="floorVisual" id="floorVisual">
                            <span class="lever"></span>
                            Timetable
                        </label>
                    </div>
                    <button class="btn-large btn-floating waves-effect waves-light deep-orange right addRule" data-toggle="1">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </div>
            <div id="roomRules" class="col s12">
                <div class="red-text hidden center flow-text" id="noRoomRules" style="margin-top: 20px;">There are no rules for this room.<br />Add one using the button below</div>
                <div class="rules-list"></div>
                <div class="row rules-timetable" style="position:relative;"></div>
                <div class="row buttons-row">
                    <div class="switch left">
                        <label>
                            List
                            <input type="checkbox" name="roomVisual" id="roomVisual">
                            <span class="lever"></span>
                            Timetable
                        </label>
                    </div>
                    <button class="btn-large btn-floating waves-effect waves-light deep-orange right addRule" data-toggle="2">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </div>
            <div id="windowRules" class="col s12">
                <div class="red-text hidden center flow-text" id="noWindowRules" style="margin-top: 20px;">There are no rules for this window <br />Add one using the button below</div>
                <div class="rules-list"></div>
                <div class="row rules-timetable" style="position:relative;"></div>
                <div class="row buttons-row">
                    <div class="switch left">
                        <label>
                            List
                            <input type="checkbox" name="windowVisual" id="windowVisual">
                            <span class="lever"></span>
                            Timetable
                        </label>
                    </div>
                    <button class="btn-large btn-floating waves-effect waves-light deep-orange right addRule" data-toggle="3">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </div>
        </div>
        <!-- END Rules table -->

        <!-- Modals -->
        <div class="container">

            <!-- Add Rule Modal -->
            <div id="addModal" class="modal">
                <div class="modal-content">
                    <h4 class="deep-orange-text">New Rule</h4>
                    <div class="card-panel red-text lighten-1 hidden" id="addRuleErrors"></div>
                    <div id="addRuleContainer">

                        <form class="col s12" method="post" id="addRuleForm" action="/rules/?mode=add&home=${home}&floor=${floor.id}">
                            <div class="row">
                                <div class="input-field col s12">
                                    <i class="mdi-editor-mode-edit blue-grey-text prefix"></i>
                                    <input id="name" type="text" class="validate" name="name" required="required">
                                    <label for="name">Rule Name (EG: Morning Rule)</label>
                                </div>
                            </div>
                            <div class="row hidden">
                                <div class="input-field col s2">
                                    <i class="mdi-image-style blue-grey-text prefix"></i>
                                    <label for="scope">Scope</label>
                                </div>
                                <div class="input-field col s5">
                                    <select class="validate" id="scope" name="scope" required="required" disabled>
                                        <option value="1">Floor</option>
                                        <option value="2">Room</option>
                                        <option value="3">Window</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s2">
                                    <i class="mdi-av-timer blue-grey-text prefix"></i>
                                    <label>Timer</label>
                                </div>
                                <div class="input-field col s5">
                                    <input type="text" name="startTime" id="startTime" class="validate" required="required" data-autoclose="true"/>
                                    <label for="startTime">Start Time</label>
                                </div>
                                <div class="input-field col s5">
                                    <input type="text" name="endTime" id="endTime" class="validate" required="required" data-autoclose="true"/>
                                    <label for="endTime">End Time</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s2">
                                    <i class="mdi-editor-vertical-align-bottom blue-grey-text prefix"></i>
                                    <label for="closedPercentage">Closed&#37;</label>
                                </div>
                                <div class="input-field col s10">
                                    <p class="range-field">
                                        <input type="range" id="closedPercentage" name="closedPercentage" min="0" max="100" value="100" />
                                    </p>
                                </div>
                            </div>
                            <div>
                                <input type="hidden" name="home" value="${home}">
                                <input type="hidden" name="floor" value="${floor.id}">
                                <input type="hidden" name="rooms" value="">
                            </div>
                            <div class="row buttons-row">
                                <button class="btn-flat waves-effect waves-orange deep-orange-text right" type="submit" name="submit">
                                    Save
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

            <!-- Remove Rule Confirm Modal -->
            <div id="confirmModal" class="modal">
                <div class="modal-content">
                    <h4 class="deep-orange-text">Remove Rule</h4>
                    <p class="flow-text">You are removing a rule! You won't be able to undo that.</p>
                    <input type="hidden" value="" name="targetRule" />
                </div>
                <div class="modal-footer">
                    <a class="modal-action modal-close waves-effect waves-orange btn-flat deep-orange-text right" id="agreeRemove">
                        Agree
                    </a>
                    <a class="modal-action modal-close waves-effect waves-orange btn-flat left" id="disagreeRemove">
                        Disagree
                    </a>
                </div>
            </div>

			<!-- Save rules modal -->
			<div id="savingModal" class="modal">
				<div class="modal-content">
					<h4 class="deep-orange-text">Saving rules..</h4>
					<p class="flow-text">Don't close this page while saving your rule. <br />This process may take a while.</p>
                    <!-- Errors -->
                    <div class="card-panel red-text lighten-1 row container hidden" id="saveRulesErrors"></div>
                    <div class="progress">
                        <div class="indeterminate"></div>
                    </div>
				</div>
			</div>

        </div><!-- END Modals -->

    </div>

<script type="text/javascript" src="/assets/js/fabric.min.js"></script>
<script type="text/javascript" src="/assets/js/fabricExtended.js"></script>
<script type="text/javascript" src="/assets/js/rulesManager.js"></script>
<script type="text/javascript" src="/assets/js/jquery-clockpicker.min.js"></script>

<script>

    $('#startTime').clockpicker();
    $('#endTime').clockpicker();

    var windows = [<#list windows as w>${w},</#list>];
    var rooms = [<#list rooms as r>${r},</#list>];

    $(document).ready(function() {
        // load canvas
        var floorCanvas = '<#if floor.canvas?has_content>${ floor.canvas }<#else>{"rooms":[]}</#if>';
        var decJson = JSON.parse(floorCanvas);
        var rooms = [];

        // decode rooms
        for (var i = 0; i < decJson.rooms.length; i++) {
            rooms.push(decJson.rooms[i]);
        }

        // calc max and min
        var val = calcRoomsMinAndMaxCoords(rooms);

        // adj canvas
        var height = (val.max.y - val.min.y) * 1.2;
        var width = $('#fabric').attr('width');
        $('canvas').css('height', '');
        $('canvas').attr('height', height);
        $('.canvas-container').css('height', height);

        var actualCenter = {x: (val.min.x+val.max.x)/2, y: (val.min.y+val.max.y)/2};
        var destCenter = {x: width/2, y: height/2};

        // adjust pos and draw
        rooms = adjustRoomsPos(rooms, actualCenter, destCenter);
        for (i = 0; i < rooms.length; i++) {
            drawRoomFromJson(rooms[i]);
        }


        // init
        changeMode(0);
        changeShowGrid(false);
        editFloor();
        $('select').material_select();

        // add rule modal
        $('#rulesArea')
            .on('click', '.addRule', function() {
                var sel = $('#addModal');
                sel.find('select[name="scope"]').val(scope);
                sel.find('h4').html("Add "+sel.find('select[name="scope"] option:selected').text()+" Rule");
                sel.openModal();
            })
            .on('mouseover', 'tbody tr', function() {
                if (scope != 3) { // with windows this has no sense
                    var ruleIndex = parseInt($(this).attr('data-toggle'));
                    selectPolysAndShuttersByRule(ruleIndex);
                }
            })
            .on('mouseout', 'tbody tr', function() {
                if (scope != 3) { // with windows this has no sense
                    switch (scope) {
                        case 1://floor
                            resetPolysAndShutsFillColor();
                            break;
                        case 2:// room
                            changeShuttersFillColor(currEditPoly, -1, true);
                            break;
                    }
                }
            });


        $('#startTime').on('change', function() {
            if (!checkTimes()) {
                $(this).val('');
            }
        });

        $('#endTime').on('change', function() {
            if (!checkTimes()) {
                $(this).val('');
            }
        });

        function checkTimes() {
            var start = $('#startTime').val().split(':');
            var end = $('#endTime').val().split(':');
            if (start.length > 0 && end.length > 0) {
                var startTime = parseInt(start[0])*60+parseInt(start[1]);
                var endTime = parseInt(end[0])*60+parseInt(end[1]);
                if (startTime > endTime) {
                    Materialize.toast('End time must be past the start time!',4000,'rounded');
                    return false;
                }
            }
            return true;
        }

        $('#floorVisual').on('change', function() {
            var sel = $('#floorRules');
            if ($(this).is(':checked')) {
                $(sel).find('.rules-list').hide();
                $(sel).find('.rules-timetable').show();
            } else {
                $(sel).find('.rules-timetable').hide();
                $(sel).find('.rules-list').show();
            }
        });

        $('#roomVisual').on('change', function() {
            var sel = $('#roomRules');
            if ($(this).is(':checked')) {
                $(sel).find('.rules-list').hide();
                $(sel).find('.rules-timetable').show();
            } else {
                $(sel).find('.rules-timetable').hide();
                $(sel).find('.rules-list').show();
            }
        });

        $('#windowVisual').on('change', function() {
            var sel = $('#windowRules');
            if ($(this).is(':checked')) {
                $(sel).find('.rules-list').hide();
                $(sel).find('.rules-timetable').show();
            } else {
                $(sel).find('.rules-timetable').hide();
                $(sel).find('.rules-list').show();
            }
        });

    });

</script>
</@layout.mainLayout>
