package it.unimore.awd.classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Floor {
    Long id;
    Home house;
    String canvas;
    Integer type;

    public Floor(){
    }

    public Floor(Long id, Home house, String canvas, Integer type){
        super();
        this.id=id;
        this.house=house;
        this.canvas=canvas;
        this.type=type;
    }

    public Home getHouse() {return house;}
    public void setHouse(Home house) {
        this.house = house;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getCanvas() {
        return canvas;
    }
    public void setCanvas(String canvas) {
        this.canvas = canvas;
    }
    public Integer getType() {
        return type;
    }
    public void setType(Integer type) {
        this.type = type;
    }

    @Override public String toString(){
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }
}
