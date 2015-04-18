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
    <div class="row">

        <!-- Canvas -->
        <div class="col l12">
            <div class="row l10 offset-l1 m10 offset-m1 s10 offset-s1">
                <h4 class="col s12 amber-text center">Manage Floors Rules</h4>
            </div>

            <!-- This is necessary to create fancy alignment -->
            <div class="col l10 offset-l1 m10 offset-m1 s10 offset-s1">
                <h5>Plant Floor Area</h5>
            </div>

            <div class="canvas col l10 offset-l1 m10 offset-m1 s10 offset-s1 left">
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

        <div class="col s10 offset-s1" id="rulesArea">
            <div class="col s12">
                <ul class="tabs z-depth-1">
                    <li class="tab col s4"><a class="active" href="#floorRules"><i class="mdi-maps-layers prefix"></i>&nbsp;&nbsp;Floor Rules</a></li>
                    <li class="tab col s4"><a href="#roomRules"><i class="mdi-navigation-apps prefix"></i>&nbsp;&nbsp;Room Rules</a></li>
                    <li class="tab col s4"><a href="#windowRules"><i class="mdi-image-crop-portrait prefix"></i>&nbsp;&nbsp;Window Rules</a></li>
                </ul>
            </div>
            <div id="floorRules" class="col s12">
                <div class="card-panel red lighten-1 hidden" id="noFloorRules">There are no rules for this floor.</div>
                <div class="rules-list"></div>
            </div>
            <div id="roomRules" class="col s12">
                <div class="card-panel red lighten-1 hidden" id="noRoomRules">There are no rules for this room.</div>
                <div class="rules-list"></div>
                <!--<div class="nosel">No room selected! Select one for managing its rules.</div>-->
            </div>
            <div id="windowRules" class="col s12">
                <div class="card-panel red lighten-1 hidden" id="noWindowRules">There are no rules for this window</div>
                <div class="rules-list"></div>
                <!--<div class="nosel">No window selected! Select one for managing its rules.</div>-->
            </div>
        </div>


        <br><br>


        <!-- TODO: used fordebugging, to be removed -->
        <div class="row">
            <!-- List of rooms -->
            <div class="col l5 m5 s10 offset-l1 offset-m1 offset-s1">
                <h5>Rooms list</h5>
                <div class="row">
                    <ul>
                        <#list rooms as r>
                            ${r.roomNum}

                        </#list>
                    </ul>
                </div>
            </div>
        </div>
        <div class="row">
            <!-- List of windows -->
            <div class="col l5 m5 s10 offset-l1 offset-m1 offset-s1">
                <h5>Rooms list</h5>
                <div class="row">
                    <ul>
                        <#list windows as w>
                            ${w.windowId}

                        </#list>
                    </ul>
                </div>
            </div>
        </div>
		

        <!-- Modals -->
        <div class="container">


            <!-- Add Rule Modal -->
            <div id="addModal" class="modal">
                <div class="modal-content">
                    <h4>Add Rule</h4>
                    <div class="card-panel red lighten-1 hidden" id="addRuleErrors"></div>
                    <div id="addRuleContainer">

                        <form class="col s12" method="post" id="addRuleForm">
                            <div class="row">
                                <div class="input-field col s12">
                                    <i class="mdi-editor-mode-edit prefix"></i>
                                    <input id="description" type="text" class="validate" name="description" required="required">
                                    <label for="description">Brief description (EG: beach house)</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s2">
                                    <i class="mdi-image-style prefix"></i>
                                    <label for="scope">Scope</label>
                                </div>
                                <div class="input-field col s5">
                                    <select class="browser-default validate" id="scope" name="scope" required="required" disabled>
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
                                    <select class="browser-default validate" id="startTimeH" name="startTimeH" required="required">
                                        <option value="" disabled selected>Hour</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <label for="startTimeH" class="hidden">Start Time Hour</label>
                                    <select class="browser-default validate" id="startTimeM" name="startTimeM" required="required">
                                        <option value="" disabled selected>Minutes</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <label for="startTimeM" class="hidden">Start Time Minute</label>
                                </div>
                                <div class="input-field col s5">
                                    <select class="browser-default validate" id="endTimeH" name="endTimeH" required="required">
                                        <option value="" disabled selected>Hour</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <label for="endTimeH" class="hidden">End Time Hour</label>
                                    <select class="browser-default validate" id="endTimeM" name="endTimeM" required="required">
                                        <option value="" disabled selected>Minutes</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <label for="endTimeM" class="hidden">End Time Minute</label>
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
                            <div class="row buttons-row">
                                <button class="btn-floating btn-large waves-effect waves-light amber right" type="submit" name="submit">
                                    <i class="mdi-content-add"></i>
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>


			<!-- Save rules modal -->
			<div id="savingModal" class="modal">
				<div class="modal-content">
					<h4>Saving rules..</h4>
					<p>Don't close this page! Bla bla bla</p>
                    <!-- Errors -->
                    <div class="card-panel red lighten-1 row container hidden" id="saveRulesErrors"></div>
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

<script>

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

        // add rule modal
        $('#rulesArea').on('click', '.addRule', function() {
            var scope = $(this).attr('data-toggle');
            var sel = $('#addModal');
            sel.find('select[name="scope"]').val(scope);
            sel.openModal();
        });

    });
</script>
</@layout.mainLayout>
