package it.unimore.awd.controllers;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import freemarker.template.*;

@SuppressWarnings("serial")
public class Controller extends HttpServlet {

    protected Configuration cfg;
    protected HttpServletRequest req;
    protected HttpServletResponse resp;

    public void init() {
        //FreeMarker configuration initialization;
        cfg = new Configuration();//create a FreeMarker configuration object
        // set a "views" directory
        cfg.setServletContextForTemplateLoading(getServletContext(), "WEB-INF/views");
        cfg.setDefaultEncoding("UTF-8");
        cfg.setNumberFormat("0.######");
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        doGet(req,resp);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        this.req = req;
        this.resp = resp;

        System.out.println( "Controller: " + req.getServletPath());

        String s = req.getPathInfo();
        if(s!=null){
            String[] s1 = s.split("/");
            if(s1.length>1){
                System.out.println( "Action: " + s1[1]);
                try {
                    java.lang.reflect.Method method = this.getClass().
                            getMethod(s1[1]);

                    try {
                        method.invoke(this, new Object[] {});
                    } catch (IllegalArgumentException e) {
                        e.printStackTrace();
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    } catch (InvocationTargetException e) {
                        e.printStackTrace();
                    }

                } catch (SecurityException e1) {
                    e1.printStackTrace();
                } catch (NoSuchMethodException e1) {
                    try {
                        this.errorpage("Page not found!");
                    } catch (ServletException e) {
                        e.printStackTrace();
                    }

                }
            }
        }
    }

    public void errorpage(String message)
            throws IOException, ServletException{
        Map<String,String> root = new HashMap<String,String>();
        root.put("message", message);
        TemplateHelper.callTemplate(cfg,resp,"/errorpage.ftl",root);
    }

}