<#macro footerLayout showFooter=true>
    <#if showFooter>
    <footer class="page-footer blue-grey darken-3">
        <div class="container">
            <div class="row">
                <div class="col l6 s12">
                    <h5 class="white-text">About DOMOShades</h5>
                    <p class="grey-text text-lighten-4">DOMOShades wants to be a simple project for easily manage domotic shutters.<br />
                    This project is and will always be completely open source and it's only available for academic use.</p>
                </div>
                <div class="col l4 offset-l2 s12">
                    <h5 class="white-text">Links</h5>
                    <ul>
                        <li><a class="grey-text text-lighten-3" href="#!">Link GitHub_API</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link GitHub_Progetto</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link Materialize</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link Canvas</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-copyright">
            <div class="container">
                © 2015 <a href="#" class="white-text">Luca Gallinari</a> & <a href="#" class="white-text">Dario Stabili</a>
            </div>
        </div>
    </footer>
    <#else>

    </#if>

    <script type="text/javascript" src="/assets/js/materialize.min.js"></script>
    <script type="text/javascript" src="/assets/js/customs.js"></script>


    <script type="text/javascript">
        $(document).ready(function() {
            if($('.tooltipped').length>0) {
                $('.tooltipped').tooltip({delay: 0});
            }
        });
    </script>

</#macro>