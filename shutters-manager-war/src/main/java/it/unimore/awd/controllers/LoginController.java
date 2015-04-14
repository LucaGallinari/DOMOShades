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
            resp.sendRedirect("/homes/");
        } else { // not logged,show
            Map<String, Object> root = new HashMap<String, Object>();
            root.put("loginURL", userService.createLoginURL(req.getRequestURI()));
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/login.ftl", root);
        }
    }
}