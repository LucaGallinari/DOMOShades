package it.unimore.awd.controllers;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import it.unimore.awd.DomoWrapper;
import it.unimore.awd.classes.Floor;
import it.unimore.awd.classes.FloorToken;
import it.unimore.awd.classes.Room;
import it.unimore.awd.classes.User;

import javax.servlet.ServletException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.*;

// import com.google.appengine.api.users.User; same name as domo user

@SuppressWarnings("serial")
public class FloorsController extends Controller {

    public static final String ctrlName = "";

    private boolean ajax = true;

    private UserService userService = UserServiceFactory.getUserService();
    private com.google.appengine.api.users.User gaeUser = userService.getCurrentUser();

    DomoWrapper domoWrapper = new DomoWrapper();

    public void root()
        throws IOException, ServletException {
        String error = "";
        this.ajax = false;

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
            if (homeIdStr != null && !homeIdStr.isEmpty()) { // check home par exists

                // get floors
                List<FloorToken> fl = domoWrapper.getFloorsByHome(owner, homeIdStr);

                List<FloorType> fk = this.getFloorTypes();

                // model the page
                Map<String, Object> root = new HashMap<String, Object>();
                root.put("error", error);
                root.put("message", "Floor!");
                root.put("userEmail", owner);
                root.put("userNick", domoUser.getFirst_name()); // TODO: usernick is not the same as firstname
                root.put("logoutURL", userService.createLogoutURL("/"));
                root.put("home", homeIdStr);
                root.put("floorTypes", fk);
                root.put("floors", fl);
                // output it
                TemplateHelper.callTemplate(cfg, resp, ctrlName + "/floors.ftl", root);

            } else { // no home selected, redirect
                resp.sendRedirect("/homes/");
            }
        } else { // not logged, redirect
            resp.sendRedirect("/");
        }
        this.ajax = true;
    }


    /*
     *  Add floor.
     *  If called by another function (eg: root()) you need to set ajax global variable to false.
     *  If called through ajax you only need to send the form with "serialized" data.
     *
     *  @ret String Ok if succes+sful, an error if not.
    */
    public String add()
            throws IOException, ServletException
    {
        String error="";
        if (gaeUser != null) { // already logged

            String homeIdStr = req.getParameter("home");
            if (homeIdStr != null && !homeIdStr.isEmpty()) { // check home par exists

                // retrieve parameters
                String canvas = req.getParameter("canvas");
                String floorId = req.getParameter("id");
                String type = req.getParameter("type");
                if (!(floorId.isEmpty())) {// add floor
                    try {
                        Floor f = domoWrapper.putFloor(gaeUser.getEmail(), homeIdStr, floorId, type, canvas);
                        System.out.println("Piano inserito.");
                        if (this.ajax) {
                            resp.getWriter().write("Ok: "+f.getId());
                        } else {
                            resp.sendRedirect("/floors?home="+homeIdStr);
                        }
                    } catch (Exception e) {
                        System.out.println("Piano non inserito perchè già presente!");
                        if (this.ajax) {resp.getWriter().write("Error: this floor for this home already exists!");}
                        else {error = "4";}
                    }
                } else {// error
                    if (this.ajax) { resp.getWriter().write("Error: one or more mandatory inputs were empty!");}
                    else {error = "3";}
                }
            } else { // no home selected, redirect
                if (this.ajax) {resp.getWriter().write("Error: home parameter not specified.");}
                else {error="2";}
            }
        } else { // not logged, error
            if (this.ajax) {resp.getWriter().write("Error: you are not logged in.");}
            else {error="1";}
        }
        return error;
    }


    /*
     *  Remove floor.
     *  If called by another function (eg: root()) you need to set ajax global variable to false.
     *  If called by ajax you only need to send the form with "serialized" data.
     *
     *  @par home Id of the home
     *  @par floor Id of the floor
     *  @ret String Ok if successful, an error if not.
    */
    public String remove()
        throws IOException, ServletException
    {
        String error="";

        if (gaeUser != null) { // already logged
            String owner = gaeUser.getEmail();

            String homeIdStr = req.getParameter("home");
            if (homeIdStr != null && !homeIdStr.isEmpty()) { // check home par exists

                String floorIdStr = req.getParameter("floor");
                if (floorIdStr != null && !floorIdStr.isEmpty()) { // check home par exists

                    try {
                        domoWrapper.deleteFloor(owner, homeIdStr, floorIdStr);
                        if (this.ajax) {
                            resp.getWriter().write("Ok");
                        } else {
                            resp.sendRedirect("/floors?home="+homeIdStr);
                        }
                    } catch (Exception e) { // home not found
                        System.out.println("Piano non cancellato perchè non trovato!");
                        if (this.ajax) {resp.getWriter().write("Error: this floor has already been deleted!");}
                        else {error = "4";}
                    }
                } else { // no home selected, redirect
                    if (this.ajax) {resp.getWriter().write("Error: floor parameter not specified.");}
                    else {error="3";}
                }
            } else { // no home selected, redirect
                if (this.ajax) {resp.getWriter().write("Error: home parameter not specified.");}
                else {error="2";}
            }
        } else { // not logged, error
            if (this.ajax) {resp.getWriter().write("Error: you are not logged in.");}
            else {error="1";}
        }
        return error;
    }

    private List<FloorType> getFloorTypes() {
        List<FloorType> lk = Arrays.asList(
            new FloorType(0, "None"),
            new FloorType(1, "Ground floor"),
            new FloorType(2, "1&deg floor"),
            new FloorType(3, "2&deg floor"),
            new FloorType(4, "3&deg floor"),
            new FloorType(5, "4&deg floor"),
            new FloorType(6, "5&deg floor"),
            new FloorType(7, "6&deg floor"),
            new FloorType(8, "Attic"),
            new FloorType(9, "1&deg underground floor"),
            new FloorType(10, "2&deg underground floor")
        );
        return lk;
    }

    public class FloorType {
        public Integer id;
        public String str;
        public FloorType(Integer id, String str){
            this.id=id;
            this.str=str;
        }
        public Integer getId() {return id;}
        public void setId(Integer id) {this.id = id;}
        public String getStr() {return str;}
        public void setStr(String str) {this.str = str;}
        @Override public String toString(){
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            return gson.toJson(this);
        }
    }

    private boolean compareDomouserGaeuser(User domoUser, com.google.appengine.api.users.User gaeUser) {
        return (
            domoUser.getFirst_name().equals(gaeUser.getNickname())
            && domoUser.getLast_name().equals(gaeUser.getNickname())
        );
    }
}