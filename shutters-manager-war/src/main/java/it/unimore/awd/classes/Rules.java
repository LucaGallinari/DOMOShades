package it.unimore.awd.classes;

public class Rules {
    private String name;
    private Integer priority;
    private Time startTime;
    private Time endTime;
    private Integer closedPercentage;

    public Rules(){

    }

    public Rules(String name, Integer priority, Integer startTimeHours, Integer startTimeMinutes, Integer endTimeHours ,Integer endTimeMinutes, Integer closedPercentage) {
        super();
        this.name = name;
        this.priority = priority;
        this.startTime=new Time(startTimeHours,startTimeMinutes);
        this.endTime=new Time(endTimeHours,endTimeMinutes);
        this.closedPercentage = closedPercentage;
    }

    public Rules(String name, Integer priority, String startTime, String endTime, Integer closedPercentage) {
        super();
        this.name = name;
        this.priority = priority;
        this.startTime=new Time(startTime);
        this.endTime=new Time(endTime);
        this.closedPercentage = closedPercentage;
    }

    public Rules(String name, String priority, String startTime, String endTime, String closedPercentage) {
        super();
        this.name = name;
        this.priority = Integer.parseInt(priority);
        this.startTime=new Time(startTime);
        this.endTime=new Time(endTime);
        this.closedPercentage = Integer.parseInt(closedPercentage);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public Integer getClosedPercentage() {
        return closedPercentage;
    }

    public void setClosedPercentage(Integer closedPercentage) {
        this.closedPercentage = closedPercentage;
    }

    public boolean equals(Rules r){
        if(this.name.equals(r.name) &&
                this.priority.equals(r.priority) &&
                this.closedPercentage.equals(r.closedPercentage) &&
                this.startTime.getHour().equals(r.startTime.getHour()) &&
                this.startTime.getMinutes().equals(r.startTime.getMinutes()) &&
                this.endTime.getHour().equals(r.endTime.getHour()) &&
                this.endTime.getMinutes().equals(r.endTime.getMinutes())){
            return true;
        }
        return false;
    }

    public int hashCode(){
        return this.name.hashCode();
    }


}
