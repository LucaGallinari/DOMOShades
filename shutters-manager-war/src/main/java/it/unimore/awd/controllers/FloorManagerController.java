package it.unimore.awd.controllers;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import it.unimore.awd.DomoWrapper;
import it.unimore.awd.classes.*;
import org.restlet.resource.ResourceException;

import javax.servlet.ServletException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// import com.google.appengine.api.users.User; same name as domo user

@SuppressWarnings("serial")
public class FloorManagerController extends Controller {

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
                    TemplateHelper.callTemplate(cfg, resp, ctrlName + "/floorManager.ftl", root);

                } else { // no floor selected, redirect
                    resp.sendRedirect("/floors/?home="+homeIdStr);
                }
            } else { // no home selected, redirect
                resp.sendRedirect("/homes/");
            }
        } else { // not logged, redirect
            resp.sendRedirect("/");
        }
        this.ajax=true;
    }

    /*
    *  Modify floor.
    *  If called by another function (eg: root()) you need to set ajax global variable to false.
    *  If called by ajax you only need to send the form with "serialized" data.
    *
    *  @ret String Ok if successful, an error if not.
    */
    public String modify()
            throws IOException, ServletException, URISyntaxException, ResourceException
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
                                // 2a- Add room
                                roomData room = gson.fromJson(roomJson, roomData.class);
                                Room r = domoWrapper.putRoom(owner, homeIdStr, floorIdStr, idRoom, room.name);
                                if (r == null) {
                                    System.out.println("Error: room not added, id:"+idRoom);
                                } else {
                                    // add roomJson to the floor's canvas
                                    floorCanvas += ((floorCanvas.isEmpty()) ? roomJson : ","+roomJson);
                                    // 2b- Add shutters of the room
                                    List<shutterData> lsd = room.getShutters();
                                    for (shutterData sd : lsd) {
                                        Window w;
                                        try {
                                            w = domoWrapper.putWindow(owner, homeIdStr, floorIdStr, idRoom, sd.getId().toString());
                                        } catch(ResourceException e) {// maybe this window is a "zombie"
                                            List<Window> wl = domoWrapper.deleteWindow(owner, homeIdStr, floorIdStr, idRoom, sd.getId().toString());
                                            w = domoWrapper.putWindow(owner, homeIdStr, floorIdStr, idRoom, sd.getId().toString());
                                        }
                                        if (w == null) {
                                            System.out.println("Error: window not added, room:" + idRoom + " id:" + sd.getId());
                                        }
                                    }
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
                                    // add roomJson to the floor's canvas
                                    floorCanvas += ((floorCanvas.isEmpty()) ? roomJson : ","+roomJson);
                                    // 2b- Add new shutters of the room
                                    for (shutterData sd : room.getShutters()) {
                                        if (sd.isNews()) {
                                            Window w;
                                            try {
                                                w = domoWrapper.putWindow(owner, homeIdStr, floorIdStr, idRoom, sd.getId().toString());
                                            } catch(ResourceException e) {// maybe this window is a "zombie"
                                                List<Window> wl = domoWrapper.deleteWindow(owner, homeIdStr, floorIdStr, idRoom, sd.getId().toString());
                                                w = domoWrapper.putWindow(owner, homeIdStr, floorIdStr, idRoom, sd.getId().toString());
                                            }
                                            if (w == null) {
                                                System.out.println("Error: window not added, room:" + idRoom + " id:" + sd.getId());
                                            }
                                        }
                                    }
                                    // 2c- Delete removed shutters
                                    for (Long idShutt : room.getRemovedShutters()) {
                                        List<Window> wl = domoWrapper.deleteWindow(owner, homeIdStr, floorIdStr, idRoom, idShutt.toString());
                                        if (wl == null) {
                                            System.out.println("Error: window not deleted, room:" + idRoom + " id:" + idShutt);
                                        }
                                    }
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


    private boolean compareDomouserGaeuser(User domoUser, com.google.appengine.api.users.User gaeUser) {
        return (
            domoUser.getFirst_name().equals(gaeUser.getNickname())
            && domoUser.getLast_name().equals(gaeUser.getNickname())
        );
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

    /*
     * Helper classes for reading JSON data from the canvas
     * and write them into the db.
    */
    static public class roomData {
        private Long id;
        private String name;
        private posData pos;
        private List<coordData> points;
        private List<shutterData> shutters;
        private List<Long> removedShutters;

        public roomData(){}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public posData getPos() {
            return pos;
        }

        public void setPos(posData pos) {
            this.pos = pos;
        }

        public List<coordData> getPoints() {
            return points;
        }

        public void setPoints(List<coordData> points) {
            this.points = points;
        }

        public List<shutterData> getShutters() {
            return shutters;
        }

        public void setShutters(List<shutterData> shutters) {
            this.shutters = shutters;
        }

        public List<Long> getRemovedShutters() {
            return removedShutters;
        }

        public void setRemovedShutters(List<Long> removedShutters) {
            this.removedShutters = removedShutters;
        }
    }

    static public class shutterData {
        Long id;
        Long angle;
        posData2 pos;
        boolean news;

        public shutterData(){}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getAngle() {
            return angle;
        }

        public void setAngle(Long angle) {
            this.angle = angle;
        }

        public posData2 getPos() {
            return pos;
        }

        public void setPos(posData2 pos) {
            this.pos = pos;
        }

        public boolean isNews() {
            return news;
        }

        public void setNews(boolean news) {
            this.news = news;
        }
    }

    static public class posData {
        String left;
        String top;

        public posData(){}

        public String getLeft() {
            return left;
        }

        public void setLeft(String left) {
            this.left = left;
        }

        public String getTop() {
            return top;
        }

        public void setTop(String top) {
            this.top = top;
        }
    }

    static public class posData2 {
        String x;
        String y;

        public posData2(){}

        public String getX() {
            return x;
        }

        public void setX(String x) {
            this.x = x;
        }

        public String getY() {
            return y;
        }

        public void setY(String y) {
            this.y = y;
        }
    }

    static public class coordData {
        String x;
        String y;

        public coordData(){}

        public String getX() {
            return x;
        }

        public void setX(String x) {
            this.x = x;
        }

        public String getY() {
            return y;
        }

        public void setY(String y) {
            this.y = y;
        }
    }

}