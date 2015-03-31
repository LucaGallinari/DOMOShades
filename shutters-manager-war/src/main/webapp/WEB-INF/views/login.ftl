<#-- Some checks -->
<#if !message??>
    <#assign message="ERROR: value for 'message' not passed to the template."/>
</#if>

<#-- Import and display -->
<#import "layout/loginLayout.ftl" as layout>
<@layout.mainLayout>
    ${message}
</@layout.mainLayout>