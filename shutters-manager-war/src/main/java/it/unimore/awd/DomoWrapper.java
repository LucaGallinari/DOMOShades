package it.unimore.awd;

import it.unimore.awd.classes.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.restlet.data.MediaType;
import org.restlet.resource.ClientResource;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.List;

public class DomoWrapper {
    private static final int MAX_LENGHT = 1800;
    private String uri;
    private String scope;
    private String domain;

    public DomoWrapper(){
        this.uri="http://domoshades-apis.appspot.com/api";
        this.domain="domoshades-apis.appspot.com";
        //this.uri="http://localhost:8080/api";
        this.scope="";
    }


    /** User Functions **/
    public User getUser(String email) throws IOException {
        this.scope="/user?email="+email;
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.get(MediaType.APPLICATION_JSON).getText();
        if(returnString==null)
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,User.class);
    }

    public User putUser(String email, String first_name, String last_name, String profile_pic) throws IOException {
        this.scope=String.format("/user?email=%s&first_name=%s&last_name=%s&profile_pic=%s",email,first_name,last_name,profile_pic);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(User.class).getText();
        if(returnString==null)
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,User.class);
    }

    public User deleintteUser(String email) throws IOException {
        this.scope="/user?email="+email;
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString==null)
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,User.class);
    }

    /** Home functions **/

    public List<Home> getHomesByUser(String owner) throws IOException {
        this.scope="/home?owner="+owner;
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.get(MediaType.APPLICATION_JSON).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<List<Home>> token = new TypeToken<List<Home>>(){};
        return gson.fromJson(returnString,token.getType());
    }

    public Home updateHome(String owner, Long home, String description, String city, int cap, String country, String address) throws IOException {
        this.scope= String.format("/home?owner=%s&home=%s&description=%s&city=%s&cap=%s&country=%s&address=%s", owner, home , URLEncoder.encode(description, "UTF-8"), URLEncoder.encode(city,"UTF-8"), cap, URLEncoder.encode(country,"UTF-8"), URLEncoder.encode(address,"UTF-8"));
        ClientResource cr = new ClientResource(uri+scope);
        System.out.println(uri+scope);
        String returnString = cr.put(Home.class).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,Home.class);
    }

    public Home putHome(String owner, String description, String city, int cap, String country, String address) throws IOException {
        this.scope= String.format("/home?owner=%s&description=%s&city=%s&cap=%s&country=%s&address=%s", owner, URLEncoder.encode(description, "UTF-8"), URLEncoder.encode(city,"UTF-8"), cap, URLEncoder.encode(country,"UTF-8"), URLEncoder.encode(address,"UTF-8"));
        ClientResource cr = new ClientResource(uri+scope);
        System.out.println(uri+scope);
        String returnString = cr.put(Home.class).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,Home.class);
    }

    public List<Home> deleteHome(String owner, String id) throws IOException {
        this.scope="/home?owner="+owner+"&id="+id;
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<List<Home>> token = new TypeToken<List<Home>>(){};
        return gson.fromJson(returnString,token.getType());
    }

    /** Floor Functions **/

    public List<FloorToken> getFloorsByHome(String owner, String home) throws IOException {
        this.scope=String.format("/floor?owner=%s&home=%s", owner,home);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.get(MediaType.APPLICATION_JSON).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<List<FloorToken>> token = new TypeToken<List<FloorToken>>(){};
        List<FloorToken> lf = gson.fromJson(returnString,token.getType());
        return lf;
    }

    /**
    public Floor putFloor(String owner, String home, String id, String type, String canvas) throws IOException, URISyntaxException {
        this.scope=String.format("owner=%s&home=%s&id=%s&type=%s&canvas=%s", owner,home,id,type,canvas);
        URI uri = new URI(
            "http",
            this.domain,
            "/api/floor",
            this.scope,
            null
        );
        String request = uri.toASCIIString();
        ClientResource cr = new ClientResource(request);
        System.out.println(request);
        String returnString = cr.put(Floor.class).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,Floor.class);
    }
    */

    public Floor putFloor(String owner, String home, String id, String type, String canvas) throws IOException {
        this.scope=String.format("/floor?owner=%s&home=%s&id=%s&type=%s&canvas=%s", owner,home,id,type,canvas);

        String completeUrl = uri+scope;

        String returnString;

        if(completeUrl.length()>=MAX_LENGHT){
            this.scope=String.format("/floor?owner=%s&home=%s&id=%s&type=%s", owner,home,id,type);
            ClientResource cr = new ClientResource(uri+scope);
            System.out.println(uri+scope);
            returnString = cr.put(canvas).getText();
        }
        else{
            ClientResource cr = new ClientResource(uri+scope);
            System.out.println(uri+scope);

            returnString = cr.put(Floor.class).getText();
        }



        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,Floor.class);
    }

    public List<Floor> deleteFloor(String owner, String home, String id) throws IOException {
        this.scope=String.format("/floor?owner=%s&home=%s&id=%s", owner,home,id);
        ClientResource cr = new ClientResource(uri+scope);
        System.out.println(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<List<Floor>> token = new TypeToken<List<Floor>>(){};
        return gson.fromJson(returnString,token.getType());
    }

    /** Room functions **/

    public List<Room> getRoomsByFloor(String owner, String home, String id) throws IOException {
        this.scope=String.format("/room?owner=%s&home=%s&id=%s", owner,home,id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.get(MediaType.APPLICATION_JSON).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<List<Room>> token = new TypeToken<List<Room>>(){};
        return gson.fromJson(returnString,token.getType());
    }

    public Room putRoom(String owner, String home, String id, String room_id, String name) throws IOException, URISyntaxException {
        this.scope=String.format("owner=%s&home=%s&id=%s&room_id=%s&name=%s", owner, home, id, room_id, name);
        URI uri = new URI(
                "http",
                this.domain,
                "/api/room",
                this.scope,
                null);
        String request = uri.toASCIIString();

        ClientResource cr = new ClientResource(request);
        System.out.println(request);
        String returnString = cr.put(Room.class).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,Room.class);
    }

    public List<Room> deleteRoom(String owner, String home, String id, String room_id) throws IOException {
        this.scope=String.format("/room?owner=%s&home=%s&id=%s&room_id=%s", owner,home,id,room_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<List<Room>> token = new TypeToken<List<Room>>(){};
        return gson.fromJson(returnString,token.getType());
    }

    /** Window functions **/

    public List<Window> getWindowsOfRoom(String owner, String home, String id, String room_id) throws IOException {
        this.scope=String.format("/window?owner=%s&home=%s&id=%s&room_id=%s", owner,home,id,room_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.get(MediaType.APPLICATION_JSON).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<List<Window>> token = new TypeToken<List<Window>>(){};
        return gson.fromJson(returnString,token.getType());
    }

    public Window putWindow(String owner, String home, String id, String room_id, String window_id) throws IOException {
        this.scope=String.format("/window?owner=%s&home=%s&id=%s&room_id=%s&window_id=%s", owner,home,id,room_id,window_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Window.class).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        return gson.fromJson(returnString,Window.class);
    }

    public List<Window> deleteWindow(String owner, String home, String id, String room_id, String window_id) throws IOException {
        this.scope=String.format("/window?owner=%s&home=%s&id=%s&room_id=%s&window_id=%s", owner,home,id,room_id,window_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<List<Window>> token = new TypeToken<List<Window>>(){};
        return gson.fromJson(returnString,token.getType());
    }

    /** Rules Functions **/

    public Window putRule(String owner, String home, String id, String room_id, String window_id, String rule_name, Integer rule_priority, String rule_start, String rule_end, Integer rule_closed) throws IOException{
        this.scope=String.format("/rule?owner=%s&home=%s&id=%s&room_id=%s&window_id=%s&rule_name=%s&rule_priority=%s&rule_start=%s&rule_end=%s&rule_closed=%s",owner,home,id,room_id,window_id,rule_name,rule_priority.toString(),rule_start,rule_end,rule_closed.toString());
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Rules.class).getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<Window> token = new TypeToken<Window>(){};
        return gson.fromJson(returnString,token.getType());
    }


    public Window deleteRule(String owner, String home, String id, String room_id, String window_id, String rule_name, Integer rule_priority, String rule_start, String rule_end, Integer rule_closed) throws IOException{
        this.scope=String.format("/rule?owner=%s&home=%s&id=%s&room_id=%s&window_id=%s&rule_name=%s&rule_priority=%s&rule_start=%s&rule_end=%s&rule_closed=%s",owner,home,id,room_id,window_id,rule_name,rule_priority.toString(),rule_start,rule_end,rule_closed.toString());
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        Gson gson = new Gson();
        TypeToken<Window> token = new TypeToken<Window>(){};
        return gson.fromJson(returnString,token.getType());
    }

    /** SpecialRules Functions **/

    /** CloseScopes */
    public String closeWindow(String owner, String home, String id, String room_id, String window_id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&rule=0&type=3&id=%s&room_id=%s&window_id=%s",owner,home,id,room_id,window_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(null).getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String closeRoom(String owner, String home, String id, String room_id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&rule=0&type=2&id=%s&room_id=%s",owner,home,id,room_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Rules.class).getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String closeFloor(String owner, String home, String id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&rule=0&type=1&id=%s",owner,home,id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Rules.class).getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String closeHome(String owner, String home) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&rule=0&type=0",owner,home);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Rules.class).getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    /** OpenScopes */
    public String openWindow(String owner, String home, String id, String room_id, String window_id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&rule=1&type=3&id=%s&room_id=%s&window_id=%s",owner,home,id,room_id,window_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Rules.class).getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String openRoom(String owner, String home, String id, String room_id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&rule=1&type=2&id=%s&room_id=%s",owner,home,id,room_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Rules.class).getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String openFloor(String owner, String home, String id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&rule=1&type=1&id=%s",owner,home,id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Rules.class).getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String openHome(String owner, String home) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&rule=1&type=0",owner,home);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.put(Rules.class).getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    /** RemoveScopes */

    public String removeSpecialFromWindow(String owner, String home, String id, String room_id, String window_id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&type=3&id=%s&room_id=%s&window_id=%s",owner,home,id,room_id,window_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String removeSpecialFromRoom(String owner, String home, String id, String room_id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&type=2&id=%s&room_id=%s",owner,home,id,room_id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String removeSpecialFromFloor(String owner, String home, String id) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&type=1&id=%s",owner,home,id);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }

    public String removeSpecialFromHome(String owner, String home) throws IOException {
        this.scope=String.format("/custom?owner=%s&home=%s&type=0",owner,home);
        ClientResource cr = new ClientResource(uri+scope);
        String returnString = cr.delete().getText();
        if(returnString.equals("[]"))
            return null;
        return returnString;
    }


}