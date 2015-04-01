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

<#-- Import and display -->
<#import "layout/baseLayout.ftl" as layout>
<@layout.mainLayout userNick userEmail logoutURL>
    <div style="color: rgb(250,10,10);">
        <#if homes?has_content>
            <h3>Homes list</h3>
            <#list homes as home>
                <p>Item: ${home.desription} - ${home.city}</p>
            </#list>
        <#else>
            <h3>No homes found!</h3>
        </#if>
    </div>
</@layout.mainLayout>
