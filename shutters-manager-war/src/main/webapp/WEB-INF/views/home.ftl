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
<#if !error??>
    <#assign error=""/>
</#if>

<#-- Import and display -->
<#import "layout/baseLayout.ftl" as layout>
<@layout.mainLayout userNick userEmail logoutURL>
    <div class="row">
        <h4 class="amber-text">Homes list</h4>
            <table id="listHomes" class="hoverable <#if !homes?has_content>hidden</#if>">
                <thead>
                    <tr>
                        <th data-field="description">Brief description</th>
                        <th data-field="address">Address</th>
                        <th data-field="city">City</th>
                        <th data-field="country">Country</th>
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
                            <a data-toggle="${home.id}" class="medium waves-effect waves-red btn-flat removeHome">
                                <i class="mdi-action-highlight-remove red-text"></i>
                            </a>
                        </td>
                    </tr>
                </#list>
                </tbody>
            </table>
            <div id="noHomes" class="card-panel red lighten-1 <#if homes?has_content>hidden</#if>">
                No homes found! Insert one by using the form below.
            </div>
    </div>

    <div class="divider"></div>

    <div class="row" style="margin-top: 20px;" id="addHome">

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
                    <input id="decsription" type="text" class="validate" name="description" required="required">
                    <label for="decsription">Brief description (EG: beach house)</label>
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
                <button class="btn-floating btn-large waves-effect waves-light amber right" type="submit" name="submit"><i class="mdi-content-add"></i></button>
            </div>
        </form>
    </div>

    <script type="text/javascript">
        $(document).ready(function(){

            /* - REMOVE HOME - */
            $('#listHomes').on('click', 'a.removeHome', function() {
                // pre ajax request
                var id = $(this).attr('data-toggle');
                var parentId = "#removeHome"+id;
                $(parentId).html(preloader_wrapper());

                // do an ajax req
                $.ajax({
                    url: "/home/remove?id="+id
                })
                .done(function( data ) {
                    if (data.toString()=="Ok") { // if everything's ok
                        toast('Home removed!', 3000, 'rounded');
                        $(parentId).parent().hide(500, function(){
                            // some animations
                            $(parentId).parent().remove();
                            if ($('.removeHome').length==0) {
                                $('#listHomes').hide();
                                $('#noHomes').show(500);
                            }
                        });

                    } else { // if not display error
                        $(parentId).html(data.toString());
                    }
                });
            });

            /* - ADD HOME - */
            $("#addHomeForm").submit(function() {
                // pre ajax request
                var buttonsRow = $('#addHomeForm').find('.buttons-row').first();
                buttonsRow.find('button').hide();
                buttonsRow.append(preloader_wrapper());

                // do an ajax req
                $.ajax({
                    type: "POST",
                    url: "/home/add",
                    data: $(this).serialize() // serializes the form's elements.
                })
                .done(function( data ) {
                    data = data.toString();
                    if (data.indexOf("Ok")!=-1) { // if everything's ok
                        toast('Home added!', 3000, 'rounded');
                        var id = data.substr(4, data.length-4);
                        addListElement(id);
                        buttonsRow.find('.preloader-wrapper').hide();
                        buttonsRow.find('button').show();
                        $('#addHomeForm').trigger("reset");

                    } else { // if not display error
                        $('#addHomeErrors').html(data.toString());
                    }
                });
                return false; // avoid to execute the actual submit of the form.
            });
        });

        function addListElement(id) {
            // get values
            var addr = $('input[name="address"]').first().val()+", "+$('input[name="address_number"]').first().val();
            var descr = $('input[name="description"]').first().val();
            var city = $('input[name="city"]').first().val();
            var country = $('input[name="country"]').first().val();

            // add element
            var el = $(list_element(id, descr, addr, country, city));
            el.hide();
            $('#listHomes').find('tbody').append(el);
            el.fadeIn();
        }

        function list_element(id, descr, addr, country, city) {
            return ' \
            <tr class="new"> \
                <td>'+descr+'</td> \
                <td>'+addr+'</td> \
                <td>'+country+'</td> \
                <td>'+city+'</td> \
                <td id="removeHome'+(id)+'"> \
                    <a data-toggle="'+(id)+'" class="medium waves-effect waves-red btn-flat removeHome"> \
                    <i class="mdi-action-highlight-remove red-text"></i> \
                </a> \
                </td> \
            </tr>';
        }

        function preloader_wrapper() {
            return ' \
            <div class="preloader-wrapper small active right"> \
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
