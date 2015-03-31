package it.unimore.awd.controllers;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class GeneralController extends Controller {

    public static final String ctrlName = "";

    public void login() throws IOException, ServletException
    {
        /* check user login */
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        if (user != null) { // already logged, redirect
            resp.sendRedirect("/index");
        } else { // not logged,show
            String msg = "Please <a href='"+ userService.createLoginURL(req.getRequestURI())+ "'>LogIn</a>";
            Map<String, Object> root = new HashMap<String, Object>();
            root.put("message", msg);
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/login.ftl", root);
        }
    }

    public void index() throws IOException, ServletException
    {
        /* check user login */
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        if (user != null) { // already logged
            Map<String, Object> root = new HashMap<String, Object>();
            root.put("message", "Index!");
            root.put("userEmail", user.getEmail());
            root.put("userNick", user.getNickname());
            root.put("logoutURL", userService.createLogoutURL(req.getRequestURI()));
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/index.ftl", root);
        } else { // not logged, redirect
            resp.sendRedirect("/login");
        }
    }
}