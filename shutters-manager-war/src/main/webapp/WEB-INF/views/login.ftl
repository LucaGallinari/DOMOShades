<#-- Some checks -->
<#if !loginURL??>
    <#assign message="ERROR: value for 'loginURL' not passed to the template."/>
</#if>

<#-- Import and display -->
<#import "layout/loginLayout.ftl" as layout>
<@layout.mainLayout>
<div class="logo-title">
    <img src="/assets/images/logo.svg">
</div>
<div class="card-content">
        <p>Yo biatch</p>
    </div>
    <div class="card-action">
        <a href="${loginURL}" class="waves-effect waves-light btn-large"><i class="mdi-action-account-circle right"></i>button</a>
    </div>
</@layout.mainLayout>