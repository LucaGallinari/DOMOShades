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
<#if !error??>
    <#assign error=""/>
</#if>

<#-- Import and display -->
<#import "layout/baseLayout.ftl" as layout>
<@layout.mainLayout userNick userEmail logoutURL>

    <div class="container">

        <!-- Table + Modals -->
        <div class="row">
            <div class="xl9 offset-xl1">
                <h4 class="amber-text">Start Page!</h4>
                <a href="/homes/">Manage houses</a>
                <p>TODO</p>
            </div>
        </div><!-- END Table + Modals -->

    </div>

    <script type="text/javascript" src="/assets/js/homeManager.js"></script>

</@layout.mainLayout>
