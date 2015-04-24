<#macro footerLayout showFooter=true>
    <#if showFooter>
    <footer class="page-footer indigo darken-4">
        <div class="container">
            <div class="row">
                <div class="col l6 s12">
                    <h5 class="deep-orange-text text-lighten-3">About DOMOShades</h5>
                    <p class="grey-text text-lighten-4">DOMOShades aims to be a simple project for easily manage domotic shutters.<br />
                    This project is made for academic purposes using MaterializeCss and will always be completely open source.<br />
                    If you want to see the source code please check out the GitHub repos.<br />
                    For any other comunications feel free to contact the developers via mail.</p>
                </div>
                <div class="col l4 offset-l2 s12">
                    <h5 class="deep-orange-text text-lighten-3">Source Code Links</h5>
                    <ul>
                        <li><a class="grey-text text-lighten-3" href="https://github.com/BrosDs/DomoShades_APIs" target="_blank">DomoShades APIs</a></li>
                        <li><a class="grey-text text-lighten-3" href="https://github.com/LucaGallinari/DOMOShades" target="_blank">DomoShades Web</a></li>
                        <li><a class="grey-text text-lighten-3" href="http://materializecss.com/" target="_blank">MaterializeCss</a></li>
                        <!--<li><a class="grey-text text-lighten-3" href="#!">Link Canvas</a></li>-->
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-copyright">
            <div class="container">
                © 2015 <a href="mailto:luke.gallinari@gmail.com" class="deep-orange-text text-lighten-3">Luca Gallinari</a> & <a href="mailto:brosds@gmail.com" class="deep-orange-text text-lighten-3">Dario Stabili</a>
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