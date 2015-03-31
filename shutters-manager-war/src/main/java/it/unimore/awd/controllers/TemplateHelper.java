package it.unimore.awd.controllers;

import java.io.IOException;
import java.io.Writer;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

public class TemplateHelper {
    @SuppressWarnings("rawtypes")
    public static void callTemplate(Configuration cfg,
                                    HttpServletResponse resp,
                                    String template,
                                    Map root)
            throws IOException, ServletException
    {
        Template t = cfg.getTemplate(template); // Get the template object
        resp.setContentType("text/html; charset=utf-8");
        Writer out = resp.getWriter();
        try {
            t.process(root, out); // Merge the data-model and the template
        } catch (TemplateException e) {
            throw new ServletException(
                    "Error while processing FreeMarker template", e);
        }
    }
}