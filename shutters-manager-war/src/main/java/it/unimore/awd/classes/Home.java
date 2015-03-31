package it.unimore.awd.classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Home {
    Long id;
    User owner;
    String description;
    String city;        //Città
    int cap;            //CAP
    String country;     //Paese
    String address;     //Indirizzo con Civico

    public Home(){
    }

    public Home(User owner, Long id, String description, String city, int cap, String country, String address){
        super();
        this.owner=owner;
        this.id=id;
        this.description=description;
        this.city=city;
        this.cap=cap;
        this.country=country;
        this.address=address;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public int getCap() {
        return cap;
    }

    public void setCap(int cap) {
        this.cap = cap;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override public String toString(){
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }

}