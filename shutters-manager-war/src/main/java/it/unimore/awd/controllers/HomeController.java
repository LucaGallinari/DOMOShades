package it.unimore.awd.controllers;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import it.unimore.awd.DomoWrapper;

@SuppressWarnings("serial")
public class HomeController extends Controller {

    public static final String ctrlName = "";

    public void root() throws IOException, ServletException
    {
        /* check user login */
        UserService userService = UserServiceFactory.getUserService();
        User gaeUser = userService.getCurrentUser();

        if (gaeUser != null) { // already logged

            DomoWrapper domoWrapper = new DomoWrapper();

            // check if user is
            it.unimore.awd.classes.User domoUser = domoWrapper.getUser(gaeUser.getEmail());
            if (!compareDomouserGaeuser(domoUser, gaeUser)) {
                System.out.println(
                    domoWrapper.putUser(
                        gaeUser.getEmail(),
                        gaeUser.getNickname(),
                        gaeUser.getNickname(),
                        "http://dummy.pic/ture"
                    )
                );
            }

            // init the page
            Map<String, Object> root = new HashMap<String, Object>();
            root.put("message", "Home!");
            root.put("userEmail", domoUser.getEmail());
            root.put("userNick", domoUser.getFirst_name()); // TODO: usernick is not the same as firstname
            root.put("logoutURL", userService.createLogoutURL(req.getRequestURI()));
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/home.ftl", root);
        } else { // not logged, redirect
            resp.sendRedirect("/");
        }
    }


    private boolean compareDomouserGaeuser(it.unimore.awd.classes.User domoUser, User gaeUser) {
        return (
            domoUser.getFirst_name().equals(gaeUser.getNickname())
            && domoUser.getLast_name().equals(gaeUser.getNickname())
        );
    }
}