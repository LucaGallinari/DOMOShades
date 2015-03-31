package it.unimore.awd.classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Room {
    Floor floor;
    Long roomNum;
    String name;

    public Room(){

    }

    public Room(Floor floor, Long roomNum, String name){
        super();
        this.floor=floor;
        this.roomNum=roomNum;
        this.name=name;
    }

    public Floor getFloor() {
        return floor;
    }

    public void setFloor(Floor floor) {
        this.floor = floor;
    }

    public Long getRoomNum() {
        return roomNum;
    }

    public void setRoomNum(Long roomNum) {
        this.roomNum = roomNum;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override public String toString(){
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }
}
