package it.unimore.awd.classes;

public class Time {
    private Integer hour;
    private Integer minutes;

    public Time(){

    }

    public Time(Integer hour, Integer minutes){
        super();
        this.hour=hour;
        this.minutes=minutes;
    }

    public Time(String time){
        super();
        String[] splitted = time.split(":");
        this.hour=Integer.parseInt(splitted[0]);
        this.minutes=Integer.parseInt(splitted[1]);
    }

    public Integer getHour() {
        return hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
    }

    public Integer getMinutes() {
        return minutes;
    }

    public void setMinutes(Integer minutes) {
        this.minutes = minutes;
    }
}