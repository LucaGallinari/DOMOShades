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
<#if !floors??>
    <#assign floors=[]/>
</#if>
<#if !floorId??>
    <#assign floorId=""/>
</#if>
<#if !error??>
    <#assign error=""/>
</#if>

<#assign selectedFloor=[]/>
<#list floors as floor>
    <#if floor.id == floorId>
        <#assign selectedFloor=floor/>
    </#if>
</#list>

<#-- Import and display -->
<#import "layout/baseLayout.ftl" as layout>
<@layout.mainLayout userNick userEmail logoutURL>

    <!-- Breadcrumb -->
    <div class="row">
        <div class="col s12 left">
            <p class="breadcrumb">
                <span><a href="/" class="tooltipped" data-position="bottom" data-tooltip="Start page">Start Page</a></span>
                <span><a href="/homes/" class="tooltipped" data-position="bottom" data-tooltip="List of your houses">Houses</a></span>
                <span><a href="/floors/?home=${home}" class="tooltipped" data-position="bottom" data-tooltip="List of your floors">Floors</a></span>
                <span>Floor Designer</span>
            </p>
        </div>
    </div>

    <div class="row">

        <!-- Tools + Canvas -->
        <div class="xl12">
            <div class="col l10 offset-l1 m10 offset-m1 s10 offset-s1">
                <h4 class="deep-orange-text">Draw Floor Layout</h4>

                <div class="row">
                    <div class="col l9 m9 s9 left">
                        <p class="flow-text">In this page you can design and recreate your home's floor layout.
                            <br />
                            This is necessary to have a better control over the rules in your home in the Rule page.</p>
                    </div>
                    <div class="col l1 m1 s1 right">
                        <a class="waves-effect waves-light small btn-flat modal-trigger shortcuts-modal" href="#"><i class="mdi-action-info light-blue-text"></i></a>
                        <a class="waves-effect waves-light small btn-flat modal-trigger canvas-modal" href="#"><i class="mdi-action-settings blue-grey-text"></i></a>
                    </div>
                </div>
            </div>

            <!-- This is necessary to create fancy alignment -->
            <div class="col l10 offset-l1 m10 offset-m1 s10 offset-s1">
                <h5 class="deep-orange-text">Plant Drawing Area</h5>
            </div>

            <div class="canvas col l10 offset-l1 m10 offset-m1 s10 offset-s1 left">
                <canvas id="fabric" height="500" class="z-depth-1"></canvas>
            </div>

            <div class="col l1 m1 s1 right right-align" style="height: 500px; margin-bottom: 10px; position: relative">
                <div class="fab-container" style="position: absolute; bottom: -42px">
                    <a style="margin-bottom: 42px;" href="javascript:saveCanvas('#canvasForm');" id="fancy-fab" class="btn-floating btn-large waves-effect waves-light yellow darken-2 tooltipped" data-position="left" data-delay="0" data-tooltip="Save Floor" ><i class="mdi-maps-layers"></i></a>
                </div>
            </div>

            <!-- Hidden form and buttons -->
            <div class="col s12">
                <form name="canvasForm" method="POST" id="canvasForm"
                      action="/floor/modify?home=${home}&floor=${floorId}">
                    <input type="hidden" name="roomsRemoved" value="">
                    <input type="hidden" name="roomsAdded" value="">
                    <input type="hidden" name="roomsModified" value="">
                    <input type="hidden" name="notModRooms" value="">
                    <input type="hidden" name="floorType" value="${selectedFloor.type}">
                </form>
            </div>
        </div><!-- END Tools + Canvas -->

        <div class="row">
            <!-- List of rooms -->
            <div class="col l5 m5 s10 offset-l1 offset-m1 offset-s1">
                <h5 class="deep-orange-text">Rooms list</h5>
                <div class="row">
                    <ul id="rooms-list" class="collapsible" data-collapsible="accordion"></ul>
                </div>
            </div>
        </div>
		

        <!-- Modals -->
        <div class="container">
            <!-- Ammadio Modal -->
            <div id="ammadioModal" class="modal">
                <div class="modal-content">
                    <h4 class="teal-text">No Room or Window</h4>
                    <div class="col l3 m3 s3 left">
                        <img src="/assets/images/easter_2.gif" height="180px">
                    </div>
                    <div class="col l9 m9 s9 right">
                        <p class="flow-text" style="font-size: 2em;">
                            Vuoi forse aggiungere un AMMADIO?
                        </p>
                    </div>
                </div>
            </div>

			<!-- Save canvas modal -->
			<div id="savingModal" class="modal">
				<div class="modal-content">
					<h4 class="deep-orange-text">Saving floor..</h4>
					<p class="flow-text">Don't close this page while saving your floor. <br />
                        This process may take a while.
                    </p>
                    <!-- Errors -->
                    <div class="card-panel red lighten-1 row container hidden" id="saveCanvasErrors"></div>
                    <div class="progress">
                        <div class="indeterminate"></div>
                    </div>
				</div>
			</div>

            <!-- Shortcuts modal -->
            <div id="shortcutsModal" class="modal">
                <div class="modal-content">
                    <h4 class="deep-orange-text">Keyboard Shortcuts</h4>
                    <div>
		                <p class="flow-text">Use the Canvas like a Pro!</p>
		                <ul>
		                    <li class="flow-text"><span class="indigo-text">ESC</span>&nbsp;&nbsp;Toggle "add room" and Save room while adding one.</li>
		                    <li class="flow-text"><span class="indigo-text">Q</span>&nbsp;&nbsp;Toggle "show grid".</li>
		                    <li class="flow-text"><span class="indigo-text">+/-</span>&nbsp;&nbsp;Zoom in and out the grid.</li>
		                    <li class="flow-text"><span class="indigo-text">X</span>&nbsp;&nbsp;Remove last added point while adding a room.</li>
		                    <li class="flow-text"><span class="indigo-text">Canc</span>&nbsp;&nbsp;Remove the selected object.</li>
		                </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#" class="modal-action modal-close waves-effect waves-orange btn-flat deep-orange-text" id="gotIt">
                        Got It
                    </a>
                </div>
            </div>

            <!-- Settings modal -->
            <div id="settingsModal" class="modal">
                <div class="modal-content">
                    <h4 class="deep-orange-text">Canvas Settings</h4>
                    <div class="switch">
                        <h6 class="flow-text">Show grid</h6>
                        <label>
                            Off
                            <input type="checkbox" id="showGrid" checked="checked">
                            <span class="lever"></span>
                            On
                        </label>
                    </div>
                    <div class="switch">
                        <h6 class="flow-text">Lock points on grid</h6>
                        <label>
                            Off
                            <input type="checkbox" id="lockGrid" checked="checked">
                            <span class="lever"></span>
                            On
                        </label>
                    </div>
                    <div class="switch">
                        <h6 class="flow-text">Zoom grid</h6>
                        <p class="range-field">
                            <input type="range" id="zoomGrid" min="0" max="2" value="0" />
                        </p>
                    </div>

                </div>
                <div class="modal-footer">
                    <a href="#" class="modal-action modal-close waves-effect waves-orange btn-flat deep-orange-text" id="close_modal">
                        Save
                    </a>
                </div>
            </div>
        </div><!-- END Modals -->

    </div>

<script type="text/javascript" src="/assets/js/fabric.min.js"></script>
<script type="text/javascript" src="/assets/js/fabricExtended.js"></script>
<script type="text/javascript" src="/assets/js/canvasManager.js"></script>
<script type="text/javascript" src="/assets/js/responsiveFloatingActionButton.js"></script>

<script>
    $(document).ready(function() {

        setSettings({
            useShortcuts: true,
            useMouseClick: true,
            useMode: true
        });

        $('.canvas-modal').click(function(){
            $('#settingsModal').openModal();
        });

        $('.shortcuts-modal').click(function(){
            $('#shortcutsModal').openModal();
        });

        // This command is used to initialize some elements and make them work properly
        var floorCanvas = '<#if selectedFloor.canvas?has_content>${ selectedFloor.canvas }<#else>{"rooms":[]}</#if>';
        var decJson = JSON.parse(floorCanvas);
        for (var i = 0; i < decJson.rooms.length; i++) {
            var room = decJson.rooms[i];
            drawRoomFromJson(room);
            refreshShuttersList(room.id);
        }
        changeMode(1);

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
            editRoom(parseInt($(this).attr('data-toggle')), true, false, null);
        });

    });
</script>
</@layout.mainLayout>
