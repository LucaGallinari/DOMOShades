package it.unimore.awd.controllers;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import it.unimore.awd.DomoWrapper;
import it.unimore.awd.classes.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
            if (homeIdStr != null && !homeIdStr.isEmpty()) { // check home par exists

                String floorIdStr = req.getParameter("floor");
                if (floorIdStr != null && !floorIdStr.isEmpty()) { // check home par exists

                    // get floors
                    List<FloorToken> fl = domoWrapper.getFloorsByHome(owner, homeIdStr);

                    // model the page
                    Map<String, Object> root = new HashMap<String, Object>();
                    root.put("error", error);
                    root.put("message", "Floor!");
                    root.put("userEmail", owner);
                    root.put("userNick", domoUser.getFirst_name()); // TODO: usernick is not the same as firstname
                    root.put("logoutURL", userService.createLogoutURL("/"));
                    root.put("home", homeIdStr);
                    root.put("floors", fl);
                    root.put("floorId", Integer.parseInt(floorIdStr));
                    // output it
                    TemplateHelper.callTemplate(cfg, resp, ctrlName + "/floor.ftl", root);

                } else { // no floor selected, redirect
                    resp.sendRedirect("/home/");
                }
            } else { // no home selected, redirect
                resp.sendRedirect("/home/");
            }
        } else { // not logged, redirect
            resp.sendRedirect("/");
        }
        this.ajax=true;
    }

    /*
     *  Add floor.
     *  If called by another function (eg: root()) you need to set ajax global variable
     *  to false.
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
                            resp.sendRedirect("/floor?home="+homeIdStr+"&floor="+f.getId()); //TODO: change to correct URL
                        }
                    } catch (Exception e) {
                        // TODO: not sure about this error msg
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
        //TODO: remake errors list in layouts
    }

    /*
    *  Modify floor.
    *  If called by another function (eg: root()) you need to set ajax global variable
    *  to false.
    *  If called by ajax you only need to send the form with "serialized" data.
    *
    *  @ret String Ok if successful, an error if not.
    */
    public String modify()
            throws IOException, ServletException, URISyntaxException
    {
        String error="";
        if (gaeUser != null) { // already logged
            String owner = gaeUser.getEmail();

            String homeIdStr = req.getParameter("home");
            if (homeIdStr != null && !homeIdStr.isEmpty()) { // check home par exists

                String floorIdStr = req.getParameter("floor");
                if (floorIdStr != null && !floorIdStr.isEmpty()) { // check home par exists

                    // init
                    Gson gson = new Gson();

                    // retrieve parameters
                    String roomsRemovedStr  = req.getParameter("roomsRemoved");
                    String roomsAddedStr    = req.getParameter("roomsAdded");
                    String roomsModifiedStr = req.getParameter("roomsModified");
                    String floorCanvas      = req.getParameter("notModRooms");
                    String type             = req.getParameter("floorType");

                    // split parameters
                    String[] toRem = processStringArrInput(roomsRemovedStr);
                    String[] toAdd = processStringArrInput(roomsAddedStr);
                    String[] toMod = processStringArrInput(roomsModifiedStr);

                    // 1- Remove rooms
                    if (toRem != null) {
                        for (String idRoom : toRem) {
                            List<Room> rl = domoWrapper.deleteRoom(owner, homeIdStr, floorIdStr, idRoom);
                            if (rl == null) {
                                System.out.println("Error: room not removed, id:"+idRoom);
                            }
                        }
                    }

                    // 2- Add rooms
                    if (toAdd != null) {
                        for (String idRoom : toAdd) {
                            String roomJson = req.getParameter("addRoomData"+idRoom);
                            if (roomJson!=null && !roomJson.isEmpty()) {
                                roomData room = gson.fromJson(roomJson, roomData.class);
                                Room r = domoWrapper.putRoom(owner, homeIdStr, floorIdStr, idRoom, room.name/*, roomJson*/);
                                if (r == null) {
                                    System.out.println("Error: room not added, id:"+idRoom);
                                } else {
                                    floorCanvas += ((floorCanvas.isEmpty()) ? roomJson : ","+roomJson);
                                }
                            }
                        }
                    }

                    // 3- Mod rooms
                    if (toMod != null) {
                        for (String idRoom : toMod) {
                            String roomJson = req.getParameter("modRoomData"+idRoom);
                            if (roomJson!=null && !roomJson.isEmpty()) {
                                roomData room = gson.fromJson(roomJson, roomData.class);
                                Room r = domoWrapper.putRoom(owner, homeIdStr, floorIdStr, idRoom, room.name/*, roomJson*/);
                                if (r == null) {
                                    System.out.println("Error: room not modified, id:"+idRoom);
                                } else {
                                    floorCanvas += ((floorCanvas.isEmpty()) ? roomJson : ","+roomJson);
                                }
                            }
                        }
                    }

                    // 4- Not mod rooms and escape \ character so JSON
                    // won't given error about unexpected token
                    floorCanvas="{\"rooms\": ["+floorCanvas+"]}";
                    floorCanvas = floorCanvas.replace("\\", "\\\\");

                    // 5- Update floor canvas
                    Floor f = domoWrapper.putFloor(owner, homeIdStr, floorIdStr, type, floorCanvas);
                    if (f != null) {
                        System.out.println("Piano modificato.");
                        if (this.ajax) {
                            resp.getWriter().write("Ok");
                        } else {
                            resp.sendRedirect("/floor?home=" + homeIdStr + "&floor=" + f.getId()); //TODO: change to correct URL
                        }
                    } else { // floor not modified
                        if (this.ajax) {resp.getWriter().write("Error: floor not modified (maybe this floor does not exists).");}
                        else {error="4";}
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

    private Floor getFloorById (long floorID, List<Floor> fl){
        for (Floor f: fl) {
            if (f.getId()==floorID) {
                return f;
            }
        }
        return null;
    }

    /**
     * @param strArr array of strings
     * @return String[]
     */
    private String[] processStringArrInput(String strArr) {
        if (strArr!=null) {
            if (strArr.contains(",")) { // more than one
                return strArr.split(",");
            } else { // one or none
                if (strArr.isEmpty()) {
                    return null;
                } else {
                    return new String[]{strArr};
                }
            }
        } else {
            return null;
        }
    }

    static private class roomData {
        private Long id;
        private String name;
        private posData pos;
        private List<coordData> points;
        private List<shutterData> shutters;

        public roomData(){}
    }

    static private class shutterData {
        Long id;
        Long angle;
        private posData p;

        public shutterData(){}
    }
    static private class posData {
        String left;
        String top;

        public posData(){}
    }
    static private class coordData {
        String x;
        String y;

        public coordData(){}
    }

}