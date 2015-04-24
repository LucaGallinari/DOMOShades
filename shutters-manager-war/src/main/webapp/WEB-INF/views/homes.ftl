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

<!-- Breadcrumb -->
<div class="row">
    <div class="col s12 left">
        <p class="breadcrumb">
            <span><a href="/" class="tooltipped" data-position="bottom" data-tooltip="Start page">Start Page</a></span>
            <span>Floor Designer</span>
        </p>
    </div>
</div>

<div class="container">

    <!-- Table + Modals -->
    <div class="row">
        <div class="xl9 offset-xl1">
            <h4 class="deep-orange-text">Homes List</h4>
            <table class="collection" id="listHomes" class="hoverable <#if !homes?has_content>hidden</#if>" style="position:static">
                <!--<thead>
                    <tr>
                        <th data-field="description">Brief description</th>
                        <th data-field="address">Address</th>
                        <th class="hidden-tc-sm" data-field="cap">Cap</th>
                        <th class="hidden-tc-m" data-field="city">City</th>
                        <th class="hidden-tc-sm" data-field="country">Country</th>
                        <th></th>
                    </tr>
                </thead>-->
                <tbody>
                <#list homes as home>
                    <tr id="listHome${home.id}" class="collection-item">
                        <td class="description">${home.description}</td>
                        <td class="address">${home.address}</td>
                        <td class="hidden-tc-sm cap">${home.cap}</td>
                        <td class="hidden-tc-m city">${home.city}</td>
                        <td class="hidden-tc-sm country">${home.country}</td>
                        <td><a class='dropdown-button right grey-text' href='#' data-activates='dropdown${home.id}'><i class="mdi-navigation-more-vert grey-text"></i></a></td>
                    </tr>

                    <ul id="dropdown${home.id}" class="dropdown-content">
                        <li>
                            <a href="/floors/?home=${home.id}" class="manageHome black-text">Manage</a>
                        </li>
                        <li>
                            <a data-toggle="${home.id}" class="modifyHome black-text">Edit</a>
                        </li>
                        <li>
                            <a data-toggle="${home.id}" class="removeHome black-text">Remove</a>
                        </li>
                    </ul>
                </#list>
                </tbody>
            </table>

            <div id="noHomes" class="card-panel red lighten-1 <#if homes?has_content>hidden</#if>">
                <p class="flow-text">No homes found! Insert one by using the form below.</p>
            </div>

            <!-- Remove Home Confirm Modal -->
            <div id="confirmModal" class="modal">
                <div class="modal-content">
                    <h4 class="deep-orange-text">Delete Home</h4>
                    <p class="flow-text">You are removing a home and all floors, rooms and shutters associated! You won't be able to undo that.</p>
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

            <!-- Modify Home Modal -->
            <div id="modifyModal" class="modal">
                <div class="modal-content">
                    <h4 class="deep-orange-text">Modify Home</h4>
                    <div class="card-panel red lighten-1 hidden" id="modifyHomeErrors"></div>
                    <div id="modifyHomeContainer"><!-- Form goes here --></div>
                </div>
            </div>

        </div>
    </div>
    <!-- END Table + Modals -->

    <!--<div class="divider xl9 offset-xl1"></div>-->

    <!-- Add new Home -->
    <div class="row" style="margin-top: 20px;">
        <div class="xl9 offset-xl1" id="addHome">

            <#if error!="">
                <div class="card-panel red-text lighten-1" id="addHomeErrors">
                    <#if error=="1">
                        Home not added! One or more mandatory inputs were blank.
                    <#elseif error=="2">
                        Home not added! CAP must be a number.
                    <#elseif error=="3">
                        Home not added! This home already exists.
                    </#if>
                </div>
            <#else>
                <div class="card-panel red-text lighten-1 hidden" id="addHomeErrors">
                    An unexpected error occured. Please try again a few moments.
                </div>
            </#if>

            <h4 class="deep-orange-text">Add Home</h4>
            <form class="col s12" method="post" id="addHomeForm">
                <div class="row">
                    <div class="input-field col s12">
                        <i class="mdi-editor-mode-edit blue-grey-text prefix"></i>
                        <input id="description" type="text" class="validate" name="description" required="required">
                        <label for="description">Name</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="mdi-action-explore blue-grey-text prefix"></i>
                        <input id="address" type="text" class="validate" name="address" required="required">
                        <label for="address">Address</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s8">
                        <i class="mdi-social-location-city blue-grey-text prefix"></i>
                        <input id="city" type="text" class="validate" name="city">
                        <label for="city">City</label>
                    </div>
                    <div class="input-field col s4">
                        <i class="mdi-communication-chat blue-grey-text prefix"></i>
                        <input id="icon_telephone" type="tel" class="validate" name="cap">
                        <label for="icon_telephone">Postal Code</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="mdi-social-public blue-grey-text prefix"></i>
                        <input id="country" type="text" class="validate" name="country">
                        <label for="country">Country</label>
                    </div>
                </div>
                <div class="row buttons-row">
                    <button class="btn-floating btn-large waves-effect waves-light deep-orange right" type="submit" name="submit">
                        <i class="mdi-content-add"></i>
                    </button>
                </div>
            </form>
        </div>
    </div><!-- END Add new Home -->

</div>

    <script type="text/javascript" src="/assets/js/homeManager.js"></script>

</@layout.mainLayout>
