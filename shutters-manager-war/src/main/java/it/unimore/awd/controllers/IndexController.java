package it.unimore.awd.controllers;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import it.unimore.awd.DomoWrapper;

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

        String error = "";
        UserService userService = UserServiceFactory.getUserService();
        com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

        if (gaeUser != null) { // already logged, show start page
            String owner = gaeUser.getEmail();

            // check if user has been already inserted, or if it's no updated
            it.unimore.awd.classes.User domoUser = domoWrapper.getUser(owner);
            if (domoUser == null || !compareDomouserGaeuser(domoUser, gaeUser)) { // logged in but not found in the database? add user, or update user
                try {
                    domoWrapper.putUser(
                        owner,
                        gaeUser.getNickname(),
                        gaeUser.getNickname(),
                        "http://dummy.pic/ture"
                    );
                } catch (Exception e) {
                    System.out.println("putUser failed!");
                    resp.sendRedirect("/");
                }
            }
            domoUser = domoWrapper.getUser(owner);

            // model the page
            Map<String, Object> root = new HashMap<String, Object>();
            root.put("error", error);
            root.put("message", "Start page!");
            root.put("userEmail", owner);
            root.put("userNick", domoUser.getFirst_name()); // TODO: usernick is not the same as firstname
            root.put("logoutURL", userService.createLogoutURL("/"));
            // output it
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/startpage.ftl", root);

        } else { // not logged, show login

            Map<String, Object> root = new HashMap<String, Object>();
            root.put("loginURL", userService.createLoginURL("/"));
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/login.ftl", root);

        }
    }

    private boolean compareDomouserGaeuser(it.unimore.awd.classes.User domoUser, com.google.appengine.api.users.User gaeUser) {
        return (
            domoUser.getFirst_name().equals(gaeUser.getNickname())
                    && domoUser.getLast_name().equals(gaeUser.getNickname())
        );
    }

}