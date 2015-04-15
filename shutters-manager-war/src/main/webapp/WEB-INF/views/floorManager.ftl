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
    <div class="row">

        <!-- Tools + Canvas -->
        <div class="xl12">
            <div class="row l10 offset-l1 m10 offset-m1 s10 offset-s1">
                <h4 class="col l10 m10 s10 amber-text center">Draw Floor ${ selectedFloor.id } Layout</h4>

                <div class="col l2 m2 s2">
                    <a class="waves-effect waves-light small btn-flat modal-trigger shortcuts-modal" href="#"><i class="mdi-action-info light-blue-text"></i></a>
                    <a class="waves-effect waves-light small btn-flat modal-trigger canvas-modal" href="#"><i class="mdi-action-settings blue-grey-text"></i></a>
                </div>
            </div>

            <!-- This is necessary to create fancy alignment -->
            <div class="col l10 offset-l1 m10 offset-m1 s10 offset-s1">
                <h5>Plant Drawing Area</h5>
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
                <h5>Rooms list</h5>
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
					<h4>Saving floor..</h4>
					<p>Don't close this page! The floor is being processed, it can take a while (5/10 seconds) based on the complexity of the floor.</p>
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
                    <h4>Keyboard Shortcuts</h4>
                    <div>
		                <p class="flow-text">Use the Canvas like a Pro!</p>
		                <ul>
		                    <li><span class="teal-text">ESC</span>&nbsp;&nbsp;Toggle "add room" and Save room while adding one.</li>
		                    <li><span class="teal-text">Q</span>&nbsp;&nbsp;Toggle "show grid".</li>
		                    <li><span class="teal-text">+/-</span>&nbsp;&nbsp;Zoom in and out the grid.</li>
		                    <li><span class="teal-text">X</span>&nbsp;&nbsp;Remove last added point while adding a room.</li>
		                    <li><span class="teal-text">Canc</span>&nbsp;&nbsp;Remove the selected object.</li>
		                </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#" class="modal-action modal-close waves-effect waves-green btn-flat" id="gotIt">
                        Got it!&nbsp;<i class="mdi-navigation-check green-text"></i>
                    </a>
                </div>
            </div>

            <!-- Settings modal -->
            <div id="settingsModal" class="modal">
                <div class="modal-content">
                    <h4>Canvas Settings</h4>
                    <div class="switch">
                        <h6 class="nomargin"><small>Show grid</small></h6>
                        <label>
                            Off
                            <input type="checkbox" id="showGrid" checked="checked">
                            <span class="lever"></span>
                            On
                        </label>
                    </div>
                    <div class="switch">
                        <h6 class="nomargin"><small>Lock points on grid</small></h6>
                        <label>
                            Off
                            <input type="checkbox" id="lockGrid" checked="checked">
                            <span class="lever"></span>
                            On
                        </label>
                    </div>
                    <div class="switch">
                        <label for="zoomGrid" class="nomargin"><small>Zoom grid</small></label>
                        <p class="range-field">
                            <input type="range" id="zoomGrid" min="0" max="2" value="0" />
                        </p>
                    </div>

                </div>
                <div class="modal-footer">
                    <a href="#" class="modal-action modal-close waves-effect waves-green btn-flat" id="close_modal">
                        Save&nbsp;<i class="mdi-navigation-check green-text"></i>
                    </a>
                </div>
            </div>
        </div><!-- END Modals -->

    </div>

<script type="text/javascript" src="/assets/js/fabric.min.js"></script>
<script type="text/javascript" src="/assets/js/canvasManager.js"></script>
<script type="text/javascript" src="/assets/js/floorManager.js"></script>
<script type="text/javascript" src="/assets/js/responsiveFloatingActionButton.js"></script>

<script>
    $(document).ready(function() {

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
            editRoom(parseInt($(this).attr('data-toggle')), true);
        });

    });
</script>
</@layout.mainLayout>
