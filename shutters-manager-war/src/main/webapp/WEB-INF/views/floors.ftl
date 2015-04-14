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
<#if !floorTypes??>
    <#assign floorTypes=[]/>
</#if>
<#if !floors??>
    <#assign floors=[]/>
</#if>
<#if !error??>
    <#assign error=""/>
</#if>

<#-- Import and display -->
<#import "layout/baseLayout.ftl" as layout>
<@layout.mainLayout userNick userEmail logoutURL>
<div class="container">

    <!-- Table + Modals -->
    <div class="row">
        <div class="xl9 offset-xl1">
            <h4 class="amber-text">Floors list</h4>
            <table id="listFloors" class="hoverable <#if !floors?has_content>hidden</#if>">
                <thead>
                <tr>
                    <th data-field="description">Type</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    <#list floors as floor>
                    <tr id="listFloor${floor.id}">
                        <td class="type">${floorTypes[floor.type].str}</td>
                        <td>
                            <a data-toggle="${floor.id}"
                               class="small waves-effect waves-green btn-flat modifyFloor tooltipped"
                               data-position="bottom" data-tooltip="Modify Floor Values">
                                <i class="mdi-content-create green-text"></i>
                            </a>
                            <a data-toggle="${floor.id}"
                               class="small waves-effect waves-red btn-flat removeFloor tooltipped"
                               data-position="bottom" data-tooltip="Delete Floor">
                                <i class="mdi-content-clear red-text"></i>
                            </a>
                            <a href="/floor/manage?home=${home}&floor=${floor.id}"
                               class="small waves-effect waves-blue btn-flat manageFloor tooltipped"
                               data-position="bottom" data-tooltip="Manage Floor">
                                <i class="mdi-content-forward blue-text"></i>
                            </a>
                        </td>
                    </tr>
                    </#list>
                </tbody>
            </table>
            <div id="noFloors" class="card-panel red lighten-1 <#if floors?has_content>hidden</#if>">
                No floors found! Insert one by using the form below.
            </div>

            <!-- Remove Floor Confirm Modal -->
            <div id="confirmModal" class="modal">
                <div class="modal-content">
                    <h4>Confirm floor deleting..</h4>
                    <p>You are removing a floor with all rooms and shutters associated! You won't be able to undo that.</p>
                </div>
                <div class="modal-footer">
                    <a class="modal-action modal-close waves-effect waves-green btn-flat teal-text right" id="agreeRemove">
                        Agree
                    </a>
                    <a href="#" class="modal-action modal-close waves-effect waves-red btn-flat left" id="disagreeRemove">
                        Disagree
                    </a>
                </div>
            </div>

            <!-- Modify Floor Modal -->
            <div id="modifyModal" class="modal">
                <div class="modal-content">
                    <h4>Modify floor</h4>
                    <div class="card-panel red lighten-1 hidden" id="modifyFloorErrors"></div>
                    <div id="modifyFloorContainer"><!-- Form goes here --></div>
                </div>
            </div>

        </div>
    </div><!-- END Table + Modals -->

    <div class="divider xl9 offset-xl1"></div>

    <!-- Add new Floor -->
    <div class="row" style="margin-top: 20px;">
        <div class="xl9 offset-xl1" id="addFloor">

            <#if error!="">
                <div class="card-panel red lighten-1" id="addFloorErrors">
                    <#if error=="1">
                        Floor not added! One or more mandatory inputs were blank.
                    <#elseif error=="2">
                        Floor not added! This kind of floor already exists.
                    </#if>
                </div>
            <#else>
                <div class="card-panel red lighten-1 hidden" id="addFloorErrors"></div>
            </#if>

            <h4 class="amber-text">Add Floor</h4>
            <form class="col s12" method="post" id="addFloorForm">
                <div class="row center">
                    <div class="input-field col s12 m6">
                        <select name="type" id="typef" required="required">
                            <#list floorTypes as type>
                                <#assign found=false>
                                <#list floors as f>
                                    <#if f.type!=0 && f.type==type.id>
                                        <#assign found=true>
                                    </#if>
                                </#list>
                                <#if !found>
                                    <option value="${type.id}">${type.str}</option>
                                </#if>
                            </#list>
                        </select>
                        <label for="typef">Kind of floor</label>
                    </div>
                </div>

                <input type="hidden" name="canvas" value='{"rooms":[]}' />
                <input type="hidden" name="home" value='${home}' />

                <div class="row buttons-row">
                    <button class="btn-floating btn-large waves-effect waves-light amber right" type="submit" name="submit">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </form>
        </div>
    </div><!-- END Add new Floor -->

</div>

    <script type="text/javascript">
        $(document).ready(function() {
            $('select').material_select();
        });
        var floors = [<#list floors as floor>${floor},</#list>];
        var floorTypes = [<#list floorTypes as type>${type},</#list>];
    </script>
    <script type="text/javascript" src="/assets/js/floorsManager.js"></script>

</@layout.mainLayout>