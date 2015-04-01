package it.unimore.awd.controllers;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// import com.google.appengine.api.users.User; same name as domo user
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import it.unimore.awd.DomoWrapper;

import it.unimore.awd.classes.User;
import it.unimore.awd.classes.Home;

@SuppressWarnings("serial")
public class HomeController extends Controller {

    public static final String ctrlName = "";

    private UserService userService = UserServiceFactory.getUserService();
    private com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

    DomoWrapper domoWrapper = new DomoWrapper();

    public void root()
        throws IOException, ServletException
    {
        String error = "";

        if (gaeUser != null) { // already logged
            String owner = gaeUser.getEmail();

            // check if user has been already inserted
            User domoUser = domoWrapper.getUser(owner);
            if (!compareDomouserGaeuser(domoUser, gaeUser)) {
                System.out.println(
                    domoWrapper.putUser(
                        owner,
                        gaeUser.getNickname(),
                        gaeUser.getNickname(),
                        "http://dummy.pic/ture"
                    )
                );
            }

            // wanted to add a home?
            if (req.getParameter("submit")!=null)
            {
                // retrieve parameters
                String descr = req.getParameter("description");
                String country = req.getParameter("country");
                String city = req.getParameter("city");
                int cap;
                try {
                    cap = Integer.parseInt(req.getParameter("cap"));
                } catch (NumberFormatException e) {
                    // error = "2";
                    cap = 0;
                }
                String address = req.getParameter("address");
                String address_number = req.getParameter("address_number");

                // check manadatory inputs
                if (descr.isEmpty() || address.isEmpty() || address_number.isEmpty()) {
                    error = "1";
                } else {// add home
                    System.out.println("Form inviato.");
                    System.out.println(
                        domoWrapper.putHome(
                            owner,
                            descr,
                            country,
                            cap,
                            city,
                            address+", "+address_number
                        )
                    );
                }
            }

            // get user's homes
            List<Home> hl = domoWrapper.getHomesByUser(owner);

            // model the page
            Map<String, Object> root = new HashMap<String, Object>();
            root.put("error", error);
            root.put("message", "Home!");
            root.put("userEmail", owner);
            root.put("userNick", domoUser.getFirst_name()); // TODO: usernick is not the same as firstname
            root.put("logoutURL", userService.createLogoutURL("/"));
            root.put("homes", hl);
            // output it
            TemplateHelper.callTemplate(cfg, resp, ctrlName + "/home.ftl", root);

        } else { // not logged, redirect
            resp.sendRedirect("/");
        }
    }

    /*  MUST BE CALLED WITH AJAX
     *
     *  Remove a home.
     *  @par id Id of the home
     *  @ret String Ok if successful, an error if not.
    */
    public void remove()
        throws IOException, ServletException
    {
        /* check user login */

        if (gaeUser != null) { // already logged
            String owner = gaeUser.getEmail();

            // wanted to remove a home?
            String id = req.getParameter("id");
            if (id != null) {
                domoWrapper.deleteHome(owner, id);
                resp.getWriter().write("Ok");
            } else {
                resp.getWriter().write("Error: expeced and id parameter.");
            }
        } else { // not logged, error
            resp.getWriter().write("Error: you are not logged in.");
        }
    }

    private boolean compareDomouserGaeuser(User domoUser, com.google.appengine.api.users.User gaeUser) {
        return (
            domoUser.getFirst_name().equals(gaeUser.getNickname())
            && domoUser.getLast_name().equals(gaeUser.getNickname())
        );
    }
}