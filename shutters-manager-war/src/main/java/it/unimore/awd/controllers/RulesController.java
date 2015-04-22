package it.unimore.awd.controllers;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import it.unimore.awd.DomoWrapper;
import it.unimore.awd.classes.*;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.*;

// import com.google.appengine.api.users.User; same name as domo user

@SuppressWarnings("serial")
public class RulesController extends Controller {

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

                String floorIdStr = req.getParameter("floor");
                if (floorIdStr != null && !floorIdStr.isEmpty()) { // check home par exists

                    String mode = req.getParameter("mode");

                    if (mode != null) {// list rules
                        if (mode.equals("remove")) {
                            this.remove();
                        }
                    }

                    // get floors
                    FloorToken ft = null;
                    List<FloorToken> fl = domoWrapper.getFloorsByHome(owner, homeIdStr);
                    List<FloorType> fk = this.getFloorTypes();
                    // TODO: extract a method
                    for (FloorToken f : fl) {
                        if (f.getId().toString().equals(floorIdStr)) {
                            ft = f;
                            //break;
                        }
                    }

                    if (ft != null) {

                        // get rooms
                        List<Room> rl = domoWrapper.getRoomsByFloor(owner, homeIdStr, floorIdStr);
                        List<WindowToken> wl = new ArrayList<WindowToken>();
                        if (rl != null) {
                            for (Room r : rl) {
                                List<WindowToken> wltemp = domoWrapper.getWindowsOfRoom(
                                    owner, homeIdStr, floorIdStr, r.getRoomNum().toString()
                                );
                                wl.addAll(wltemp);
                            }
                        }

                        // model the page
                        Map<String, Object> root = new HashMap<String, Object>();
                        root.put("error", error);
                        root.put("message", "Rules!");
                        root.put("userEmail", owner);
                        root.put("userNick", domoUser.getFirst_name()); // TODO: usernick is not the same as firstname
                        root.put("logoutURL", userService.createLogoutURL("/"));
                        root.put("home", homeIdStr);
                        root.put("floor", ft);
                        root.put("rooms", rl);
                        root.put("windows", wl);
                        // output it
                        TemplateHelper.callTemplate(cfg, resp, ctrlName + "/rules.ftl", root);
                    } else {// floor not found, redirect
                        resp.sendRedirect("/floors/?home="+homeIdStr);
                    }

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
     *  Add rules.
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
            String owner = gaeUser.getEmail();

            String homeIdStr = req.getParameter("home");
            if (homeIdStr != null && !homeIdStr.isEmpty()) { // check home par exists

                String floorIdStr = req.getParameter("floor");
                if (floorIdStr != null && !floorIdStr.isEmpty()) { // check home par exists

                    try {// retrieve parameters

                        // Integer scope = Integer.parseInt(req.getParameter("scope"));
                        String pJson = req.getParameter("priorities");
                        Gson gson = new Gson();
                        Priorities priorities = gson.fromJson(pJson, Priorities.class);

                        String name = req.getParameter("name");
                        Integer closePerc = Integer.parseInt(req.getParameter("closedPercentage"));

                        // start time h/m
                        Integer startTimeH  = Integer.parseInt(req.getParameter("startTimeH"));
                        Integer startTimeM  = Integer.parseInt(req.getParameter("startTimeM"));
                        String startTime    = startTimeH.toString()+':'+startTimeM.toString();

                        // end time h/m
                        Integer endTimeH    = Integer.parseInt(req.getParameter("endTimeH"));
                        Integer endTimeM    = Integer.parseInt(req.getParameter("endTimeM"));
                        String endTime      = endTimeH.toString()+':'+endTimeM.toString();

                        if (name!= null) {
                            for (RoomProp r : priorities.rooms) {
                                for (ShutProp w: r.windows) {
                                    Window tempW = domoWrapper.putRule(
                                        owner, homeIdStr, floorIdStr, r.id.toString(), w.id.toString(),
                                        name, w.priority, startTime, endTime, closePerc);
                                    if (tempW == null) {
                                        System.out.println("ERROR: tempW is null.");
                                    }
                                }
                            }
                        }

                        System.out.println("Regola aggiunta.");
                        if (this.ajax) {
                            resp.getWriter().write("Ok");
                        } else {
                            resp.sendRedirect("/rule/?home=" + homeIdStr + "&floor=" + floorIdStr);
                        }

                    } catch (Exception e) {
                        System.out.println("Rule non aggiunta perchè uno dei parametri era mancante o non convertibile!");
                        if (this.ajax) {resp.getWriter().write("Error: bad parameters!");}
                        else {error = "4";}
                    }
                } else {// error
                    if (this.ajax) { resp.getWriter().write("Error: floor parameter not specified.");}
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
     *  Remove rule.
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

                    String tJson = req.getParameter("targets");
                    if (tJson != null && !tJson.isEmpty()) {

                        Gson gson = new Gson();
                        Targets targets = gson.fromJson(tJson, Targets.class);

                        for (RoomProp r : targets.rooms) {
                            for (ShutProp w: r.windows) {
                                String startTime = targets.startTime.getHour().toString()+':'+targets.startTime.getMinutes().toString();
                                String endTime   = targets.endTime.getHour().toString()+':'+targets.endTime.getMinutes().toString();
                                try {
                                    Window tempW = domoWrapper.deleteRule(
                                        owner, homeIdStr, floorIdStr, r.id.toString(), w.id.toString(),
                                        targets.name, w.priority, startTime, endTime, targets.closedPercentage
                                    );
                                    if (tempW == null) {
                                        System.out.println("ERROR: tempW is null.");
                                    }
                                } catch (Exception e) { // home not found
                                    System.out.println("Regola non cancellata perchè non trovato!");
                                    if (this.ajax) {resp.getWriter().write("Error: this floor has already been deleted!");}
                                    else {error = "5";}
                                }
                            }
                        }

                        if (this.ajax) {
                            resp.getWriter().write("Ok");
                        } else {
                            error="";
                        }

                    } else { // no param targets
                        if (this.ajax) {resp.getWriter().write("Error: targets parameter not specified.");}
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

    private List<FloorType> getFloorTypes() {
        return Arrays.asList(
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
    }

    static public class Priorities {
        public List<RoomProp> rooms;

        public Priorities(List<RoomProp> rooms) {this.rooms = rooms;}
        public Priorities() {}
    }
    static public class Targets {
        public List<RoomProp> rooms;
        public String name;
        private Integer priority;
        private Time startTime;
        private Time endTime;
        private Integer closedPercentage;

        public Targets() {}
    }
    static public class RoomProp {
        Integer id;
        public List<ShutProp> windows;

        public RoomProp(Integer id, List<ShutProp> windows) {
            this.id = id;
            this.windows = windows;
        }
        public RoomProp() {}
    }
    static public class ShutProp {
        Integer id;
        Integer priority;

        public ShutProp(Integer priority, Integer id) {
            this.priority = priority;
            this.id = id;
        }
        public ShutProp() {}
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