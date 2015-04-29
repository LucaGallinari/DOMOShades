<#macro mainLayout userNick userEmail logoutURL homes floors>
    <html>
        <head>

            <#import "head.ftl" as head>
            <@head.headLayout />

        </head>
        <body class="grey lighten-5">
            <header>
                <nav class="top-nav indigo">
                    <div class="container">
                        <div class="nav-wrapper">
                            <a href="/homes/" class="brand-logo center"><img src="/assets/images/logo-white.svg" width="300px" height="40px" style="margin-top: 41px" ></a>
                            <a href="#" data-activates="nav-mobile" class="button-collapse top-nav full"><i class="mdi-navigation-menu"></i></a>
                        </div>
                    </div>
                </nav>
                <ul id="nav-mobile" class="side-nav fixed">

                    <li class="logo indigo darken-2">
                        <div class="user_profile">
                             <div>${userNick?substring(0,1)?cap_first}</div>
                        </div>
                        <div class="user_name"> ${userNick} </div>
                        <div class="user_email"> ${userEmail} </div>
                    </li>
                    <li class="bold">
                        <a href="${logoutURL}" class="waves-effect waves-orange">
                            <i class="mdi-hardware-keyboard-return"></i>
                            Logout
                        </a>
                    </li>
                    <li class="bold">
                        <a href="/homes/" class="waves-effect waves-orange">
                            <i class="mdi-action-settings-applications"></i>
                            Manage Homes
                        </a>
                    </li>

                    <#if homes?has_content>
                        <#list homes as home>
                        <li>
                            <ul class="collapsible" data-collapsible="accordion">
                                <li>
                                    <div class="collapsible-header bold nomargin nopadding">
                                        <a>
                                            <i class="mdi-action-home"></i>
                                            ${home.description}
                                        </a>
                                    </div>
                                    <div class="collapsible-body">
                                        <!-- Homes list -->
                                        <ul>
                                            <li class="waves-effect waves-blue">
                                                <a href="/floors/?home=${home.id}">
                                                    <i class="mdi-action-settings"></i>
                                                    Manage this house
                                                </a>
                                            </li>
                                            <li class="toggleShut waves-effect waves-teal">
                                                <a href="#" data-toggle="${home.id}" data-scope="0">
                                                    <i class="mdi-file-file-upload"></i>
                                                    Open all shutters
                                                </a>
                                            </li>
                                            <li class="toggleShut waves-effect waves-purple">
                                                <a href="#" data-toggle="${home.id}" data-scope="1">
                                                    <i class="mdi-file-file-download"></i>
                                                    Close all shutters
                                                </a>
                                            </li>
                                            <li class="toggleShut waves-effect waves-red">
                                                <a href="#" data-toggle="${home.id}" data-scope="2">
                                                    <i class="mdi-content-clear"></i>
                                                    Remove open/close
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        </#list>
                    <#else>
                    </#if>

                </ul>
            </header>

            <!-- Remove Home Confirm Modal -->
            <div id="confirmSpecialModal" class="modal">
                <div class="modal-content">
                    <h4 class="deep-orange-text">Home <span></span> all shutters</h4>
                    <p class="flow-text">You really want to <span></span> all shutters of this home?</p>
                </div>
                <div class="modal-footer">
                    <a class="modal-action modal-close waves-effect waves-green btn-flat deep-orange-text right" id="agreeSpecial">
                        Agree
                    </a>
                    <a href="#" class="modal-action modal-close waves-effect waves-red btn-flat left" id="disagreeSpecial">
                        Disagree
                    </a>
                </div>
            </div>

            <main>
                <div class="col s12 m10 l8 offset-l2 offset-m1">
                    <#nested/>
                </div>
            </main>

            <#import "footer.ftl" as footer>
            <@footer.footerLayout />

        </body>
    </html>
</#macro>