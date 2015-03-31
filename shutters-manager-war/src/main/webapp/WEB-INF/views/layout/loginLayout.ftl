<#macro mainLayout>
    <html>
        <head>

            <#import "head.ftl" as head>
            <@head.headLayout />
            <link href="/assets/css/first_page.css" rel="stylesheet">

        </head>
        <body class="blue-grey lighten-5">
            <header>
                <nav class="top-nav teal huge">
                    <div class="container">
                        <div class="nav-wrapper">
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <div class="container">
                    <div class="card xlarge">
                        <h2><#nested/></h2>
                    </div>
                </div>
            </main>

            <footer class="page-footer blue-grey lighten-5"></footer>

            <#import "footer.ftl" as footer>
            <@footer.footerLayout showFooter=false />
        </body>
    </html>
</#macro>