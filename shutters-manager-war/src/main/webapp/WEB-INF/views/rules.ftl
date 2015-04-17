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
        <div class="xl12">
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

        <div class="divider col s10 offset-s1"><br></div>

        <div class="col s10 offset-s1">
            <div class="col s12">
                <ul class="tabs z-depth-1">
                    <li class="tab col s4"><a class="active" href="#floorRules">Floor Rules</a></li>
                    <li class="tab col s4"><a href="#roomRules">Room Rules</a></li>
                    <li class="tab col s4"><a href="#windowRules">Window Rules</a></li>
                </ul>
            </div>
            <div id="floorRules" class="col s12">
            </div>
            <div id="roomRules" class="col s12">
                <!--<div class="nosel">No room selected! Select one for managing its rules.</div>-->
            </div>
            <div id="windowRules" class="col s12">
                <!--<div class="nosel">No window selected! Select one for managing its rules.</div>-->
            </div>
        </div>


        <div class="row">
            <!-- List of rooms -->
            <div class="col l5 m5 s10 offset-l1 offset-m1 offset-s1">
                <h5>Rooms list</h5>
                <div class="row">
                    <ul id="rooms-list" class="collapsible" data-collapsible="accordion"></ul>
                </div>
            </div>
        </div>
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
            <!-- List of rooms -->
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

        // This command is used to initialize some elements and make them work properly
        var floorCanvas = '<#if floor.canvas?has_content>${ floor.canvas }<#else>{"rooms":[]}</#if>';
        var decJson = JSON.parse(floorCanvas);
        for (var i = 0; i < decJson.rooms.length; i++) {
            var room = decJson.rooms[i];
            drawRoomFromJson(room);
        }
        changeMode(0);


        // rooms-list
        var sel = $('#rooms-list');
        sel.on('click', '.collapsible-header', function() {
            editRoom(parseInt($(this).attr('data-toggle')), true);
        });

    });
</script>
</@layout.mainLayout>
