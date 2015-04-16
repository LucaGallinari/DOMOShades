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
            <ul class="collection" id="listFloors" class="hoverable <#if !floors?has_content>hidden</#if>">
                <#list floors as floor>
                    <li id="listFloor${floor.id}" class="collection-item">
                        <span>${floorTypes[floor.type].str}</span>
                        <a href="/rules/?home=${home}&floor=${floor.id}"
                           class="tiny waves-effect waves-orange manageRules tooltipped right"
                           data-position="bottom" data-tooltip="Manage Rules">
                            <i class="mdi-content-content-paste orange-text"></i>
                        </a>
                        <a href="/floor/manage?home=${home}&floor=${floor.id}"
                           class="tiny waves-effect waves-blue manageFloor tooltipped right"
                           data-position="bottom" data-tooltip="Manage Floor">
                            <i class="mdi-content-forward blue-text"></i>
                        </a>
                        <a data-toggle="${floor.id}"
                           class="tiny waves-effect waves-red removeFloor tooltipped right"
                           data-position="bottom" data-tooltip="Delete Floor">
                            <i class="mdi-content-clear red-text"></i>
                        </a>
                        <a data-toggle="${floor.id}"
                           class="tiny waves-effect waves-green modifyFloor tooltipped right"
                           data-position="bottom" data-tooltip="Modify Floor Values">
                            <i class="mdi-content-create green-text"></i>
                        </a>

                    </li>
                </#list>
            </ul>

            <div id="noFloors" class="card-panel red lighten-1 <#if floors?has_content>hidden</#if>">
                No floors saved! <br />
                Insert add one using the button.
            </div>

            <div class="row buttons-row">
                <a onclick="toggleBottomCard()"
                   class="btn-floating btn-large red waves-effect waves-light right"
                        id="add-new-floor">
                    <i class="mdi-content-add"></i>
                </a>
                <!--
                <a href="#"
                   class="btn-floating btn-large red waves-effect waves-light modal-trigger add-modal tooltipped right"
                   data-position="bottom" data-tooltip="New Floor">
                    <i class="mdi-content-add"></i>
                </a>

                <a href="#!" class="btn" onclick="Materialize.showStaggeredList('#new-floor')">Click Me</a>-->
            </div>

            <!-- Remove Floor Confirm Modal -->
            <div id="confirmModal" class="modal">
                <div class="modal-content">
                    <h4>Delete Floor</h4>
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
                    <h4>Modify Floor</h4>
                    <div class="card-panel red lighten-1 hidden" id="modifyFloorErrors"></div>
                    <div id="modifyFloorContainer"><!-- Form goes here --></div>
                </div>
            </div>

            <!-- Add Floor Modal ->
            <div id="addModal" class="modal" style="min-height: 60%">
                <div class="modal-content">
                    <h4>Add Floor</h4>
                    <div class="card-panel hidden" id="addFloorErrors"></div>
                    <div id="modifyFloorContainer">
                        <form class="col s12" method="post" id="addFloorForm">
                            <div class="row center">
                                <div class="input-field col s12 m8 offset-m2">
                                    <#list floorTypes as type>
                                        <#assign found=false>
                                        <#list floors as f>
                                            <#if f.type!=0 && f.type==type.id>
                                                <#assign found=true>
                                            </#if>
                                        </#list>
                                        <#if !found>
                                            <p>
                                                <input name="group1" type="radio" id="${type.id}" value="${type.id}" />
                                                <label for="${type.id}">${type.str}</label>
                                            </p>
                                        </#if>
                                    </#list>

                                    <!--
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
                                    <label for="typef">Type of floor</label>
                                    --><!--
                                </div>
                            </div>

                            <input type="hidden" name="canvas" value='{"rooms":[]}' />
                            <input type="hidden" name="home" value='${home}' />

                            <div class="row buttons-row">
                                <button class="btn-floating btn-large waves-effect waves-light amber right" type="submit" name="submit">
                                    <i class="mdi-content-save"></i>
                                </button>
                                <a class="modal-action modal-close waves-effect waves-light btn-flat left">
                                    <i class="mdi-content-clear"></i>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            -->
        </div>
    </div>
    <!-- END Table + Modals -->
<!--
    <div class="divider xl9 offset-xl1"></div>

    <!-- Add new Floor -->
    <div class="row">
        <ul id="new-floor">
            <li style="opacity: 0;">
                <div style="margin-top: 20px;" id="new-floor">
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
                                <button class="btn-flat waves-effect waves-light right teal-text" type="submit" name="submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </li>
        </ul>
    </div><!-- END Add new Floor ->

</div>
-->
    <script type="text/javascript">
        $(document).ready(function() {
            $('select').material_select();

        });

        var floors = [<#list floors as floor>${floor},</#list>];
        var floorTypes = [<#list floorTypes as type>${type},</#list>];
    </script>
    <script type="text/javascript" src="/assets/js/floorsManager.js"></script>

</@layout.mainLayout>