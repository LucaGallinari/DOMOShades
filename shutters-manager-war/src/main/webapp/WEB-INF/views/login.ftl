<#-- Some checks -->
<#if !loginURL??>
    <#assign loginURL="/"/>
</#if>

<#-- Import and display -->
<#import "layout/loginLayout.ftl" as layout>
<@layout.mainLayout>
    <div class="logo-title">
        <img src="/assets/images/logo.svg">
    </div>
    <div class="divider"></div>
    <div class="card-content"><!--
        <p class="flow-text">DOMOShades is a simple web interface for easily manage your houses Domotic rolling shutters. <br />
        In order to use the DOMOShades services you first need to import your houses layouts and windows positions. After that you can easily manage your rolling shutters using our simple rule mechanism.</p>
        -->
        <p class="flow-text">La Mucca mu<br />La Percora bhe<br />Il Gatto miao <br />Sorrido Sempre Ciao!<br /><br /><iframe width="560" height="315" src="https://www.youtube.com/embed/ayybEMk-iDM" frameborder="0" allowfullscreen></iframe></p>
    </div>
    <div class="card-action row buttons-row">
        <p><a href="${loginURL}" class="waves-effect waves-light btn-large amber right white-text"><i class="mdi-content-forward left white-text"></i>Start DOMOShades</a></p>
    </div>
</@layout.mainLayout>