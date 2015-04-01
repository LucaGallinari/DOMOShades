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
    <div class="card-content">
        <p class="flow-text">Yo biatch! This is Trevor</p>
    </div>
    <div class="card-action">
        <a href="${loginURL}" class="waves-effect waves-light btn-large amber right"><i class="mdi-action-account-circle right"></i>button</a>
    </div>
</@layout.mainLayout>