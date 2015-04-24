<#macro mainLayout>
    <html>
        <head>

            <#import "head.ftl" as head>
            <@head.headLayout />
            <link href="/assets/css/first_page.css" rel="stylesheet">

        </head>
        <body class="blue-grey lighten-4">
            <header>
                <nav class="top-nav huge indigo">
                    <div class="container">
                        <div class="nav-wrapper">
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <div class="container">
                    <div class="card xlarge blue-grey lighten-5">
                        <div class="container">
                            <#nested/>
                        </div>
                    </div>
                </div>
            </main>
            <#import "footer.ftl" as footer>
            <@footer.footerLayout showFooter=false />
        </body>
    </html>
</#macro>