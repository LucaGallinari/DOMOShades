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

<#-- Import and display -->
<#import "layout/baseLayout.ftl" as layout>
<@layout.mainLayout userNick userEmail logoutURL>
    <div>
        <div class="row">
            <div class="section col s6">

                <h5>Homes list</h5>
            <#if homes?has_content>
                <table class="hoverable">
                    <thead>
                        <tr>
                            <th data-field="description">Brief description</th>
                            <th data-field="address">Address</th>
                            <th data-field="country">Country</th>
                            <th data-field="city">City</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                    <#list homes as home>
                        <tr>
                            <td>${home.description}</td>
                            <td>${home.address}</td>
                            <td>${home.country}</td>
                            <td>${home.city}</td>
                            <td id="removeHome${home.id}">
                                <a data-toggle="${home.id}"
                                   class="btn-floating btn-small waves-effect waves-light red removeHome">
                                    <i class="mdi-content-clear"></i>
                                </a>
                            </td>
                        </tr>
                    </#list>
                    </tbody>
                </table>
            <#else>
                <div class="card-panel red lighten-1">No homes found! Insert one by using the form below.</div>
            </#if>
            </div>
        </div>
        <div class="section row s6" id="addHome">
            <h5>Add a home</h5>
            <form class="col" method="post" name>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="mdi-editor-mode-edit prefix"></i>
                        <input id="decsription" type="text" class="validate" name="description" required="required">
                        <label for="decsription">Brief description (EG: beach house)</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="mdi-social-public prefix"></i>
                        <input id="country" type="text" class="validate" name="country">
                        <label for="country">Country</label>
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
                    <div class="input-field col s8">
                        <i class="mdi-action-explore prefix"></i>
                        <input id="address" type="text" class="validate" name="address" required="required">
                        <label for="address">Address</label>
                    </div>
                    <div class="input-field col s4">
                        <i class="mdi-maps-local-convenience-store prefix"></i>
                        <input id="icon_telephone" type="tel" class="validate" name="address_number" required="required">
                        <label for="icon_telephone">Number</label>
                    </div>
                </div>
                <div class="row">
                    <button class="btn waves-effect waves-light right" type="submit" name="submit">Add Home
                        <i class="mdi-content-add-circle right"></i>
                    </button>
                </div>
            </form>
        </div>

    </div>
    <script type="text/javascript">
        $(document).ready(function(){

            // $('.preloader-wrapper').hide();

            $('.removeHome').on('click',function() {
                var id = $(this).attr('data-toggle');
                var parentId = "#removeHome"+id;
                $(parentId).html(preloader_wrapper());
                $.ajax({
                    url: "/home/remove?id="+id
                })
                .done(function( data ) {
                    if (data.toString()=="Ok") {
                        $(parentId).parent().hide(1000);
                        $(parentId).parent().remove();
                    } else {
                        $(parentId).html(data.toString());
                    }
                    if (console && console.log ) {
                        console.log( "Remove:", data.slice( 0, 100 ) );
                    }
                });
            })
        });

        function preloader_wrapper() {
            return '<div class="preloader-wrapper small active"> \
                        <div class="spinner-layer spinner-green-only"> \
                            <div class="circle-clipper left"> \
                            <div class="circle"></div> \
                            </div><div class="gap-patch"> \
                            <div class="circle"></div> \
                            </div><div class="circle-clipper right"> \
                            <div class="circle"></div> \
                            </div> \
                        </div> \
                    </div>';
        }

    </script>
</@layout.mainLayout>
