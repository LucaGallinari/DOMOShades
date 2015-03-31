package it.unimore.awd.classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;

public class Window{
    Room room;
    Long windowId;
    List<Rules> rulesLists;

    public Window(){

    }

    public Window(Room room, Long windowId, List<Rules> rulesLists) {
        super();
        this.room = room;
        this.windowId = windowId;
        this.rulesLists = rulesLists;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Long getWindowId() {
        return windowId;
    }

    public void setWindowId(Long windowId) {
        this.windowId = windowId;
    }

    public List<Rules> getRulesLists() {
        return rulesLists;
    }

    public void setRulesLists(List<Rules> rulesLists) {
        this.rulesLists = rulesLists;
    }

    @Override public String toString(){
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }
}
