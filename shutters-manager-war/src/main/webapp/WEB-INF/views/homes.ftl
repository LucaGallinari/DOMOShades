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
    <#assign homes=[]/>
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
            <h4 class="amber-text">Homes list</h4>
            <table id="listHomes" class="hoverable <#if !homes?has_content>hidden</#if>">
                <thead>
                    <tr>
                        <th data-field="description">Brief description</th>
                        <th data-field="address">Address</th>
                        <th class="hidden-tc-sm" data-field="cap">Cap</th>
                        <th class="hidden-tc-m" data-field="city">City</th>
                        <th class="hidden-tc-sm" data-field="country">Country</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                <#list homes as home>
                    <tr id="listHome${home.id}">
                        <td class="description">${home.description}</td>
                        <td class="address">${home.address}</td>
                        <td class="hidden-tc-sm cap">${home.cap}</td>
                        <td class="hidden-tc-m city">${home.city}</td>
                        <td class="hidden-tc-sm country">${home.country}</td>
                        <td>
                            <a href="/floors/?home=${home.id}"
                               class="tiny waves-effect waves-blue manageHome tooltipped right"
                               data-position="bottom" data-tooltip="Manage Home">
                                <i class="mdi-content-forward blue-text"></i>
                            </a>
                            <a data-toggle="${home.id}"
                               class="tiny waves-effect waves-red removeHome tooltipped right"
                               data-position="bottom" data-tooltip="Delete Home">
                                <i class="mdi-content-clear red-text"></i>
                            </a>
                            <a data-toggle="${home.id}"
                               class="tiny waves-effect waves-green modifyHome tooltipped right"
                               data-position="bottom" data-tooltip="Modify Home Values">
                                <i class="mdi-content-create green-text"></i>
                            </a>
                        </td>
                    </tr>
                </#list>
                </tbody>
            </table>
            <div id="noHomes" class="card-panel red lighten-1 <#if homes?has_content>hidden</#if>">
                No homes found! Insert one by using the form below.
            </div>

            <!-- Remove Home Confirm Modal -->
            <div id="confirmModal" class="modal">
                <div class="modal-content">
                    <h4>Confirm house deleting..</h4>
                    <p>You are removing a house and all floors, rooms and shutters associated! You won't be able to undo that.</p>
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

            <!-- Modify Home Modal -->
            <div id="modifyModal" class="modal">
                <div class="modal-content">
                    <h4>Modify home</h4>
                    <div class="card-panel red lighten-1 hidden" id="modifyHomeErrors"></div>
                    <div id="modifyHomeContainer"><!-- Form goes here --></div>
                </div>
            </div>

        </div>
    </div><!-- END Table + Modals -->

    <div class="divider xl9 offset-xl1"></div>

    <!-- Add new Home -->
    <div class="row" style="margin-top: 20px;">
        <div class="xl9 offset-xl1" id="addHome">

            <#if error!="">
                <div class="card-panel red lighten-1" id="addHomeErrors">
                    <#if error=="1">
                        Home not added! One or more mandatory inputs were blank.
                    <#elseif error=="2">
                        Home not added! CAP must be a number.
                    <#elseif error=="3">
                        Home not added! This home already exists.
                    </#if>
                </div>
            <#else>
                <div class="card-panel red lighten-1 hidden" id="addHomeErrors"></div>
            </#if>

            <h4 class="amber-text">Add home</h4>
            <form class="col s12" method="post" id="addHomeForm">
                <div class="row">
                    <div class="input-field col s12">
                        <i class="mdi-editor-mode-edit prefix"></i>
                        <input id="description" type="text" class="validate" name="description" required="required">
                        <label for="description">Brief description (EG: beach house)</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="mdi-action-explore prefix"></i>
                        <input id="address" type="text" class="validate" name="address" required="required">
                        <label for="address">Address</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s8">
                        <i class="mdi-social-location-city prefix"></i>
                        <input id="city" type="text" class="validate" name="city">
                        <label for="city">City</label>
                    </div>
                    <div class="input-field col s4">
                        <i class="mdi-communication-chat prefix"></i>
                        <input id="icon_telephone" type="tel" class="validate" name="cap">
                        <label for="icon_telephone">CAP</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="mdi-social-public prefix"></i>
                        <input id="country" type="text" class="validate" name="country">
                        <label for="country">Country</label>
                    </div>
                </div>
                <div class="row buttons-row">
                    <button class="btn-floating btn-large waves-effect waves-light amber right" type="submit" name="submit">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </form>
        </div>
    </div><!-- END Add new Home -->

</div>

    <script type="text/javascript" src="/assets/js/homeManager.js"></script>

</@layout.mainLayout>
