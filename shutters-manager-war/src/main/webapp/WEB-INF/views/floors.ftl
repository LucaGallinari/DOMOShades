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
<#if !homes??>
    <#assign homes=""/>
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
<@layout.mainLayout userNick userEmail logoutURL homes floors>

<!-- Breadcrumb -->
<div class="row">
    <div class="col s12 left">
        <p class="breadcrumb">
            <span><a href="/homes/" class="tooltipped" data-position="bottom" data-tooltip="List of your houses">Homes</a></span>
            <span>Floors</span>
        </p>
    </div>
</div>

<div class="container">

    <!-- Table + Modals -->
    <div class="row">
        <div class="xl9 offset-xl1">
            <h4 class="deep-orange-text">Floor List</h4>
            <table id="listFloors" class="collection hoverable <#if !floors?has_content>hidden</#if>" style="position:static">
                <tbody>
                <#list floors as floor>
                    <tr id="listFloor${floor.id}" class="collection-item">
                        <td class="floorName" data-value="${floor.type}">
                            <span>${floorTypes[floor.type].str}</span>
                        </td>
                        <td class="floorAction">
                            <a class='dropdown-button right grey-text' href='#' data-activates='dropdown${floor.id}'><i class="mdi-navigation-more-vert grey-text"></i></a>
                            <ul id="dropdown${floor.id}" class="dropdown-content">
                                <li><a href="/floor/manage?home=${home}&floor=${floor.id}" class="manageFloor black-text">Manage</a></li>
                                <li><a data-toggle="${floor.id}" class="removeFloor black-text"> Remove </a></li>
                                <li><a href="/rules/?home=${home}&floor=${floor.id}" class="manageRules black-text"> Rules </a> </li>
                            </ul>
                        </td>
                    </tr>
                </#list>
                </tbody>
            </table>

            <div id="noFloors" class="card-panel red-text <#if floors?has_content>hidden</#if>">
                No floors saved! <br />
                Insert add one using the button.
            </div>

            <div class="row buttons-row">
                <a onclick="toggleBottomCard('#new-floor')"
                   class="btn-floating btn-large deep-orange waves-effect waves-light right"
                        id="add-new-floor">
                    <i class="mdi-content-add"></i>
                </a>
            </div>

            <!-- Remove Floor Confirm Modal -->
            <div id="confirmModal" class="modal">
                <div class="modal-content">
                    <h4 class="deep-orange-text">Delete Floor</h4>
                    <p class="flow-text">You are removing a floor with all rooms and shutters associated! You won't be able to undo that.</p>
                </div>
                <div class="modal-footer">
                    <a class="modal-action modal-close waves-effect waves-green btn-flat deep-orange-text right" id="agreeRemove">
                        Agree
                    </a>
                    <a href="#" class="modal-action modal-close waves-effect waves-red btn-flat left" id="disagreeRemove">
                        Disagree
                    </a>
                </div>
            </div>

        </div>
    </div>
    <!-- END Table + Modals -->

    <!-- Add new Floor -->
    <div class="row">
        <ul id="new-floor">
            <li style="opacity: 0;">
                <div style="margin-top: 20px;" id="new-floor">
                    <div class="xl9 offset-xl1" id="addFloor">

                        <#if error!="">
                            <div class="card-panel red-text lighten-1" id="addFloorErrors">
                                <#if error=="1">
                                    Floor not added! One or more mandatory inputs were blank.
                                <#elseif error=="2">
                                    Floor not added! This kind of floor already exists.
                                </#if>
                            </div>
                        <#else>
                            <div class="card-panel red-text lighten-1 hidden" id="addFloorErrors">
                                Ops! Something unexpected happend. Please try again in a few moments.
                            </div>
                        </#if>

                        <h4 class="deep-orange-text">Add Floor</h4>
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
                                <button class="btn-flat waves-effect waves-light right deep-orange-text" type="submit" name="submit">
                                    Save
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </li>
        </ul>
    </div><!-- END Add new Floor -->

    <script type="text/javascript">
        $(document).ready(function() {$('select').material_select();});

        var floors = [<#list floors as floor>${floor},</#list>];
        var floorTypes = [<#list floorTypes as type>${type},</#list>];
    </script>
    <script type="text/javascript" src="/assets/js/floorsManager.js"></script>

</@layout.mainLayout>