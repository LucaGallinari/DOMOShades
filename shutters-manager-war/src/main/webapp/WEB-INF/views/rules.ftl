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
<#if !floor??>
    <#assign floor=""/>
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
<@layout.mainLayout userNick userEmail logoutURL>
    <div class="container">

        <!-- Canvas -->
        <div class="row">
            <div class="row">
                <h4 class="col s12 deep-orange-text">Manage Floor Rules</h4>
            </div>

            <div class="canvas">
                <canvas id="fabric" height="500" class="z-depth-1"></canvas>
            </div>
            <!--
            <div class="col l1 m1 s1 right right-align" style="height: 500px; margin-bottom: 10px; position: relative">
                <div class="fab-container" style="position: absolute; bottom: -42px">
                    <a style="margin-bottom: 42px;" href="javascript:saveCanvas('#canvasForm');" id="fancy-fab" class="btn-floating btn-large waves-effect waves-light yellow darken-2 tooltipped" data-position="left" data-delay="0" data-tooltip="Save Floor" ><i class="mdi-maps-layers"></i></a>
                </div>
            </div>
            -->
        </div><!-- END Canvas -->

        <div class="col s12">
            <br><br>
        </div>

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
                <div class="row buttons-row">
                    <!--
                    <button class="btn waves-effect waves-light amber right addRule" data-toggle="1">
                        <i class="mdi-content-add"></i> Add Floor Rule
                    </button>
                    -->
                    <button class="btn-large btn-floating waves-effect waves-light deep-orange right addRule" data-toggle="1">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </div>
            <div id="roomRules" class="col s12">
                <div class="red-text hidden center flow-text" id="noRoomRules" style="margin-top: 20px;">There are no rules for this room.<br />Add one using the button below</div>
                <div class="rules-list"></div>
                <div class="row buttons-row">
                    <!--
                    <button class="btn waves-effect waves-light amber right addRule" data-toggle="2">
                        <i class="mdi-content-add"></i> Add Room Rule
                    </button>
                    -->
                    <button class="btn-large btn-floating waves-effect waves-light deep-orange right addRule" data-toggle="2">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </div>
            <div id="windowRules" class="col s12">
                <div class="red-text hidden center flow-text" id="noWindowRules" style="margin-top: 20px;">There are no rules for this window <br />Add one using the button below</div>
                <div class="rules-list"></div>
                <div class="row buttons-row">
                    <!--
                    <button class="btn waves-effect waves-light amber right addRule" data-toggle="3">
                        <i class="mdi-content-add"></i> Add Window Rule
                    </button>
                    -->
                    <button class="btn-large btn-floating waves-effect waves-light deep-orange right addRule" data-toggle="3">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </div>
        </div>

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
                                    <i class="mdi-editor-mode-edit prefix"></i>
                                    <input id="name" type="text" class="validate" name="name" required="required">
                                    <label for="name">Rule Name (EG: Morning Rule)</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s2">
                                    <i class="mdi-image-style prefix"></i>
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
                                    <i class="mdi-av-timer prefix"></i>
                                    <label>Timer</label>
                                </div>
                                <div class="input-field col s5">
                                    <!--<input type="text" name="startTime" id="startTime" class="time_element validate" required="required" />-->
                                    <input type="text" name="startTime" id="startTime" class="validate" required="required" data-autoclose="true"/>
                                    <label for="startTime" class="hidden">Start Time</label>
                                </div>
                                <div class="input-field col s5">
                                    <!--<input type="text" name="endTime" id="endTime" class="time_element validate" required="required" />-->
                                    <input type="text" name="endTime" id="endTime" class="validate" required="required" data-autoclose="true"/>
                                    <label for="endTime" class="hidden">End Time</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s2">
                                    <i class="mdi-editor-vertical-align-bottom prefix"></i>
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
                                <button class="btn-flat waves-effect waves-light deep-orange-text right" type="submit" name="submit">
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
                    <a class="modal-action modal-close waves-effect waves-green btn-flat teal-text right" id="agreeRemove">
                        Agree
                    </a>
                    <a class="modal-action modal-close waves-effect waves-red btn-flat left" id="disagreeRemove">
                        Disagree
                    </a>
                </div>
            </div>

			<!-- Save rules modal -->
			<div id="savingModal" class="modal">
				<div class="modal-content">
					<h4>Saving rules..</h4>
					<p class="flow-text">Don't close this page while saving your rule. This process may take a while.</p>
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
<script type="text/javascript" src="/assets/js/responsiveFloatingActionButton.js"></script>
<script type="text/javascript" src="/assets/js/timepicki.js"></script>

<script type="text/javascript" src="/assets/js/jquery-clockpicker.min.js"></script>

<script>
/*
    $('#startTime').lolliclock();
    $('#endTime').lolliclock();
*/

    $('#startTime').clockpicker();
    $('#endTime').clockpicker();

    var windows = [<#list windows as w>${w},</#list>];
    var rooms = [<#list rooms as r>${r},</#list>];


    $(document).ready(function() {
        // load canvas
        var floorCanvas = '<#if floor.canvas?has_content>${ floor.canvas }<#else>{"rooms":[]}</#if>';
        var decJson = JSON.parse(floorCanvas);
        for (var i = 0; i < decJson.rooms.length; i++) {
            var room = decJson.rooms[i];
            drawRoomFromJson(room);
        }

        // init
        changeMode(0);
        editFloor();
        $('select').material_select();
        $(".time_element").timepicki({
            show_meridian:false,
            min_hour_value:0,
            max_hour_value:23
        });


        // add rule modal
        $('#rulesArea')
            .on('click', '.addRule', function() {
                var sel = $('#addModal');
                sel.find('select[name="scope"]').val(scope);
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

    });
</script>
</@layout.mainLayout>
