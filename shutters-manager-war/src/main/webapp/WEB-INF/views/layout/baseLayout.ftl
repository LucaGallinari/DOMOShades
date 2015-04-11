<#macro mainLayout userNick userEmail logoutURL>
    <html>
        <head>

            <#import "head.ftl" as head>
            <@head.headLayout />

        </head>
        <body class="grey lighten-5">
            <header>
                <nav class="top-nav teal">
                    <div class="container">
                        <div class="nav-wrapper">
                            <a href="/" class="brand-logo center"><img src="/assets/images/logo-white.svg" width="300px" height="40px" style="margin-top: 41px" ></a>
                            <a href="#" data-activates="nav-mobile" class="button-collapse top-nav full"><i class="mdi-navigation-menu"></i></a>
                        </div>
                    </div>
                </nav>
                <ul id="nav-mobile" class="side-nav fixed">
                    <li class="logo teal  darken-2">
                        <div class="user_profile"> <img src="null" /> </div>
                        <div class="user_name"> ${userNick} </div>
                        <div class="user_email"> ${userEmail} </div>
                    </li>
                    <li class="bold"><a href="${logoutURL}" class="waves-effect waves-default">Logout</a></li>
                    <li class="bold"><a href="#" class="waves-effect waves-default">Prova</a></li>
                    <li class="bold"><a href="#" class="waves-effect waves-default">Prova</a></li>
                </ul>
            </header>


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