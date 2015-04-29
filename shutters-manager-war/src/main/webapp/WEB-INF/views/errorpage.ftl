
<#-- Some checks -->
<#if !logged??>
    <#assign logged="false"/>
</#if>
<#if !message??>
    <#assign message="ERROR: value for 'message' not passed to the template."/>
</#if>

<#if logged=="true" >
    <#-- Some checks -->
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

    <#-- Import and display -->
    <#import "layout/baseLayout.ftl" as layout>
    <@layout.mainLayout userNick userEmail logoutURL homes floors>
        <div class="row center">
            <h2 class="deep-orange-text">${message}</h2>
            <h5><a href="/homes/" style="color:#444;">Return to the homes page</a></h5>
        </div>
    </@layout.mainLayout>
<#else>

    <#-- Import and display -->
    <#import "layout/loginLayout.ftl" as layout>
    <@layout.mainLayout>
        <div class="row center">
            <h2 class="deep-orange-text">${message}</h2>
            <h5><a href="/" style="color:#444;">Return to the login page</a></h5>
        </div>
    </@layout.mainLayout>
</#if>
