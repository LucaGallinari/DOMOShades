package it.unimore.awd.controllers;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

@SuppressWarnings("serial")
public class LoginController extends Controller {

    public static final String ctrlName = "";

    public void root() throws IOException, ServletException
    {
        /* check user login */
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        if (user != null) { // already logged, redirect
            resp.sendRedirect("/home/");
        } else { // not logged,show
            String msg = "Please <a href='"+ userService.createLoginURL(req.getRequestURI())+ "'>LogIn</a>";
            Map<String, Object> root = new HashMap<String, Object>();
            root.put("message", msg);
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/login.ftl", root);
        }
    }
}