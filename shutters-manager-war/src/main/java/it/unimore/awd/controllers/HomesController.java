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
public class HomesController extends Controller {

    public static final String ctrlName = "";

    private boolean ajax = true;

    DomoWrapper domoWrapper = new DomoWrapper();

    public void root()
        throws IOException, ServletException
    {
        UserService userService = UserServiceFactory.getUserService();
        com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

        String error = "";
        this.ajax=false;

        if (gaeUser != null) { // already logged
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

            if (domoUser != null) {

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
                TemplateHelper.callTemplate(cfg, resp, ctrlName + "/homes.ftl", root);

            } else {// not yet signed up!
                resp.sendRedirect("/");
            }
        } else { // not logged, redirect
            resp.sendRedirect("/");
        }
        this.ajax=true;
    }

    /*
     *  Add home.
     *  If called by another function (eg: root()) you need to set ajax global variable to false.
     *  If called by ajax you only need to send the form with "serialized" data.
     *
     *  @ret String Ok if successful, an error if not.
    */
    public String add()
            throws IOException, ServletException
    {
        UserService userService = UserServiceFactory.getUserService();
        com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

        String error="";

        if (gaeUser != null) { // already logged
            // retrieve parameters
            String descr = req.getParameter("description");
            String country = req.getParameter("country");
            String city = req.getParameter("city");
            int cap;
            try {cap = Integer.parseInt(req.getParameter("cap"));}
            catch (NumberFormatException e) {cap = 0;}
            String address = req.getParameter("address");
            if(city==null) city="";
            if(country==null) country="";
            // check manadatory inputs
            if (!(descr.isEmpty() || address.isEmpty())) {// add home
                System.out.println("Form inviato.");
                try {
                    Home h = domoWrapper.putHome(gaeUser.getEmail(),descr,city,cap,country,address);
                    System.out.println("Casa inserita.");
                    if (this.ajax) {
                        resp.getWriter().write("Ok: "+h.getId());
                    }
                } catch (Exception e) {
                    System.out.println("Casa non inserita perchè già presente!");
                    if (this.ajax) {resp.getWriter().write("Error: this same home already exists!");}
                    else {error = "3";}
                }
            } else {// error
                if (this.ajax) { resp.getWriter().write("Error: one or more mandatory inputs were empty!");}
                else {error = "2";}
            }
        } else { // not logged, error
            if (this.ajax) {resp.getWriter().write("Error: you are not logged in.");}
            else {error="1";}
        }
        return error;
        //TODO: remake errors list in layouts
    }

    /*
    *  Modify home.
    *  If called by another function (eg: root()) you need to set ajax global variable to false.
    *  If called by ajax you only need to send the form with "serialized" data.
    *
    *  @ret String Ok if successful, an error if not.
   */
    public String modify()
            throws IOException, ServletException
    {
        UserService userService = UserServiceFactory.getUserService();
        com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

        String error="";

        if (gaeUser != null) { // already logged
            try {
                Long id = Long.parseLong(req.getParameter("id"));
                //if (id != 0) {
                    // retrieve parameters
                    String descr = req.getParameter("description");
                    String country = req.getParameter("country");
                    String city = req.getParameter("city");
                    int cap;
                    try {cap = Integer.parseInt(req.getParameter("cap"));}
                    catch (NumberFormatException e) {cap = 0;}
                    String address = req.getParameter("address");
                    if(city==null) city="";
                    if(country==null) country="";

                    // check manadatory inputs
                    if (!(descr.isEmpty() || address.isEmpty())) {// add home
                        System.out.println("Form inviato.");
                        try {
                            Home h = domoWrapper.updateHome(gaeUser.getEmail(),id,descr,city,cap,country,address);
                            System.out.println("Casa modificata.");
                            if (this.ajax) {
                                resp.getWriter().write("Ok");
                            }
                        } catch (Exception e) {
                            System.out.println("Casa non modificata perchè non è stata apportata alcuna modifica!");
                            if (this.ajax) {resp.getWriter().write("Error: you didn't make any changes to this house!");}
                            else {error = "4";}
                        }
                    } else {// error
                        if (this.ajax) {resp.getWriter().write("Error: one or more mandatory inputs were empty!");}
                        else {error = "3";}
                    }
                //} TODO: number empty?
            } catch (NumberFormatException e) {
                if (this.ajax) {resp.getWriter().write("Error: expected and id parameter.");}
                else {error="2"; }
            }
        } else { // not logged, error
            if (this.ajax) {resp.getWriter().write("Error: you are not logged in.");}
            else {error="1";}
        }
        return error;
    }

    /*
     *  Remove home.
     *  If called by another function (eg: root()) you need to set ajax global variable to false.
     *  If called by ajax you only need to send the form with "serialized" data.
     *
     *  @par id Id of the home
     *  @ret String Ok if successful, an error if not.
    */
    public String remove()
        throws IOException, ServletException
    {
        UserService userService = UserServiceFactory.getUserService();
        com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

        String error="";

        if (gaeUser != null) { // already logged
            String owner = gaeUser.getEmail();
            String id = req.getParameter("id");

            if (id != null) {
                try {
                    domoWrapper.deleteHome(owner, id);
                    if (this.ajax) {
                        resp.getWriter().write("Ok");
                    }
                } catch (Exception e) { // home not found
                    System.out.println("Casa non cancellata perchè non trovata!");
                    if (this.ajax) {resp.getWriter().write("Error: this house has already been deleted!");}
                    else {error = "3";}
                }
            } else {
                if (this.ajax) {resp.getWriter().write("Error: expected and id parameter.");}
                else {error="2";}
            }
        } else { // not logged, error
            if (this.ajax) {resp.getWriter().write("Error: you are not logged in.");}
            else {error="1";}
        }
        return error;
    }


    /*
     *  Open or close all shutters of a house.
     *  If called by another function (eg: root()) you need to set ajax global variable to false.
     *  If called by ajax you only need to send the form with "serialized" data.
     *
     *  @par id Id of the home
     *  @ret String Ok if successful, an error if not.
    */
    public String special()
            throws IOException, ServletException
    {
        UserService userService = UserServiceFactory.getUserService();
        com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

        String error="";

        if (gaeUser != null) { // already logged
            String owner = gaeUser.getEmail();
            String homeId = req.getParameter("id");
            String scope = req.getParameter("scope");

            if (homeId != null && scope != null) {
                try {
                    if (scope.equals("0")) { // open
                        domoWrapper.openHome(owner, homeId);
                    } else if (scope.equals("1")) { // close
                        domoWrapper.closeHome(owner, homeId);
                    } else if (scope.equals("2")) { // remove
                        domoWrapper.removeSpecialFromHome(owner, homeId);
                    }
                    if (this.ajax) {
                        resp.getWriter().write("Ok");
                    }
                } catch (Exception e) { // home not found
                    System.out.println("Parametri inviati errati!");
                    if (this.ajax) {resp.getWriter().write("Error: wrong parameters!");}
                    else {error = "3";}
                }
            } else {
                if (this.ajax) {resp.getWriter().write("Error: expected and id parameter.");}
                else {error="2";}
            }
        } else { // not logged, error
            if (this.ajax) {resp.getWriter().write("Error: you are not logged in.");}
            else {error="1";}
        }
        return error;
    }

    private boolean compareDomouserGaeuser(User domoUser, com.google.appengine.api.users.User gaeUser) {
        return (
            domoUser.getFirst_name().equals(gaeUser.getNickname())
            && domoUser.getLast_name().equals(gaeUser.getNickname())
        );
    }
}