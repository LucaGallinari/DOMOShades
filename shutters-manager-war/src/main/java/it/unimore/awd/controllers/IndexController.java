package it.unimore.awd.controllers;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import it.unimore.awd.DomoWrapper;
import it.unimore.awd.classes.User;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

@SuppressWarnings("serial")
public class IndexController extends Controller {

    public static final String ctrlName = "";

    DomoWrapper domoWrapper = new DomoWrapper();

    public void root() throws IOException, ServletException
    {
        UserService userService = UserServiceFactory.getUserService();
        com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

        if (gaeUser != null) { // already logged, show start page
            String owner = gaeUser.getEmail();

            it.unimore.awd.classes.User domoUser = domoWrapper.getUser(owner);
            if (domoUser != null) {//logged
                resp.sendRedirect("/homes/");
            } else { // not logged, show login
                Map<String, Object> root = new HashMap<String, Object>();
                root.put("loginURL", userService.createLoginURL("/homes/"));
                TemplateHelper.callTemplate(cfg, resp, ctrlName + "/login.ftl", root);
            }
        } else { // not logged, show login
            Map<String, Object> root = new HashMap<String, Object>();
            root.put("loginURL", userService.createLoginURL("/homes/"));
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/login.ftl", root);
        }
    }

    private boolean compareDomouserGaeuser(User domoUser, com.google.appengine.api.users.User gaeUser) {
        return (
                domoUser.getFirst_name().equals(gaeUser.getNickname())
                        && domoUser.getLast_name().equals(gaeUser.getNickname())
        );
    }
}