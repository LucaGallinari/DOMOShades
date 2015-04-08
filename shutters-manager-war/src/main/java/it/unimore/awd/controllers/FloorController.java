package it.unimore.awd.controllers;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import it.unimore.awd.DomoWrapper;
import it.unimore.awd.classes.Floor;
import it.unimore.awd.classes.Home;
import it.unimore.awd.classes.User;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// import com.google.appengine.api.users.User; same name as domo user

@SuppressWarnings("serial")
public class FloorController extends Controller {

    public static final String ctrlName = "";

    private boolean ajax = true;

    private UserService userService = UserServiceFactory.getUserService();
    private com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

    DomoWrapper domoWrapper = new DomoWrapper();

    public void manage()
        throws IOException, ServletException
    {
        String error = "";
        this.ajax=false;

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

            String homeIdStr = req.getParameter("home");
            /*if (homeIdStr != null) { // check home par exists
                try { // is it a Long?
                    long homeId = Long.parseLong(homeIdStr);
                    // get user's homes
                    List<Home> hl = domoWrapper.getHomesByUser(owner);
                    Home home = getHomeById(homeId, hl);

                    if (home != null) {*/

                        // get home's floors
                        List<Floor> fl = domoWrapper.getFloorsByHome(owner, homeIdStr);

                        // wanted to add a floor?
                        if (req.getParameter("submit")!=null) {// TODO: you can submit even with "modify" and "remove"
                            //error = this.add();
                        }

                        // model the page
                        Map<String, Object> root = new HashMap<String, Object>();
                        root.put("error", error);
                        root.put("message", "Floor!");
                        root.put("userEmail", owner);
                        root.put("userNick", domoUser.getFirst_name()); // TODO: usernick is not the same as firstname
                        root.put("logoutURL", userService.createLogoutURL("/"));
                        root.put("floors", fl);
                        // output it
                        TemplateHelper.callTemplate(cfg, resp, ctrlName + "/floor.ftl", root);

                    /*} else { // home not found
                        System.out.println("Home not found!");
                        resp.sendRedirect("/home/");
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Home ID is not a Long value!");
                    resp.sendRedirect("/home/");
                }
            } else { // no home selected, redirect
                resp.sendRedirect("/home/");
            }*/
        } else { // not logged, redirect
            resp.sendRedirect("/");
        }
        this.ajax=true;
    }

    /*
     *  Add home.
     *  If called by another function (eg: root()) you need to set ajax global variable
     *  to false.
     *  If called by ajax you only need to send the form with "serialized" data.
     *
     *  @ret String Ok if successful, an error if not.

    public String add()
            throws IOException, ServletException
    {
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
    }*/

    /*
    *  Modify home.
    *  If called by another function (eg: root()) you need to set ajax global variable
    *  to false.
    *  If called by ajax you only need to send the form with "serialized" data.
    *
    *  @ret String Ok if successful, an error if not.

    public String modify()
            throws IOException, ServletException
    {
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
    }*/

    /*
     *  Remove home.
     *  If called by another function (eg: root()) you need to set ajax global variable
     *  to false.
     *  If called by ajax you only need to send the form with "serialized" data.
     *
     *  @par id Id of the home
     *  @ret String Ok if successful, an error if not.

    public String remove()
        throws IOException, ServletException
    {
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
    }*/

    private boolean compareDomouserGaeuser(User domoUser, com.google.appengine.api.users.User gaeUser) {
        return (
            domoUser.getFirst_name().equals(gaeUser.getNickname())
            && domoUser.getLast_name().equals(gaeUser.getNickname())
        );
    }

    private Home getHomeById (long homeID, List<Home> hl){
        for (Home h: hl) {
            if (h.getId()==homeID) {
                return h;
            }
        }
        return null;
    }
}