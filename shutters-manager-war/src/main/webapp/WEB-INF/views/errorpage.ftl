
<#-- Some checks -->
<#if !logged??>
    <#assign logged="false"/>
</#if>
<#if !message??>
    <#assign message="ERROR: value for 'message' not passed to the template."/>
</#if>

<#if logged=="true" >
    <#-- TODO: this case has the same code as homes.ftl -->
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

    <#-- Import and display -->
    <#import "layout/baseLayout.ftl" as layout>
    <@layout.mainLayout userNick userEmail logoutURL>
        <div style="color: rgb(250,10,10);">
            ${message}
        </div>
    </@layout.mainLayout>
<#else>

    <#-- Import and display -->
    <#import "layout/loginLayout.ftl" as layout>
    <@layout.mainLayout>
        <div style="color: rgb(250,10,10);">
            ${message}
        </div>
    </@layout.mainLayout>
</#if>
