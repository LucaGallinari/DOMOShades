package it.unimore.awd.controllers;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.*;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
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
        doGet(req, resp);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        this.req = req;
        this.resp = resp;

        System.out.println("Controller: " + req.getServletPath());

        String s = req.getPathInfo();
        System.out.println("Path info: " + s);
        if (s != null) {
            String[] s1 = s.split("/");
            System.out.println("Action: " + (s1.length>1? s1[1] : "root"));
            try {
                java.lang.reflect.Method method;

                if (s1.length>1) {
                    method = this.getClass().getMethod(s1[1]);
                } else {// call the index page if no path has been specified = root page
                    method = this.getClass().getMethod("root");
                }
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
                    this.errorpage("404 - Page not found!");
                } catch (ServletException e) {
                    e.printStackTrace();
                }
            }
        } else {
            try {
                this.errorpage("404 - Page not found!");
            } catch (ServletException e) {
                e.printStackTrace();
            }
        }
    }

    public void errorpage(String message)
            throws IOException, ServletException {
        /* check user login */
        UserService userService = UserServiceFactory.getUserService();
        User gaeUser = userService.getCurrentUser();

        // define page variables
        Map<String, String> root = new HashMap<String, String>();
        root.put("message", message);
        root.put("logged", (gaeUser != null ? "true" : "false"));

        if (gaeUser != null) { // already logged
            root.put("userEmail", gaeUser.getEmail());
            root.put("userNick", gaeUser.getNickname()); // TODO: usernick is not the same as firstname
            root.put("logoutURL", userService.createLogoutURL(req.getRequestURI()));
        }

        TemplateHelper.callTemplate(cfg, resp, "/errorpage.ftl", root);
    }
}