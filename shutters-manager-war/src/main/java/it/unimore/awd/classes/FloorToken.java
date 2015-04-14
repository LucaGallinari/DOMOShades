package it.unimore.awd.classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class FloorToken {
    Long id;
    HouseToken house;
    String canvas;
    Integer type;

    public FloorToken(){
    }

    public FloorToken(Long id, HouseToken house, String canvas, Integer type){
        super();
        this.id=id;
        this.house=house;
        this.canvas=canvas;
        this.type=type;
    }

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
    public HouseToken getHouse() {return house;}
    public void setHouse(HouseToken house) {this.house = house;}
    public String getCanvas() {return canvas;}
    public void setCanvas(String canvas) {this.canvas = canvas;}
    public Integer getType() {return type;}
    public void setType(Integer type) {this.type = type;}
    @Override public String toString(){
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }

    static public class HouseToken {
        KeyToken key;

        public HouseToken(){
        }
        public HouseToken(KeyToken key) {
            this.key=key;
        }

        public KeyToken getKey() {return key;}
        public void setKey(KeyToken key) {this.key = key;}

        static public class KeyToken {
            RawToken raw;

            public KeyToken(){
            }
            public KeyToken(RawToken raw) {
                this.raw = raw;
            }

            public RawToken getRaw() {return raw;}
            public void setRaw(RawToken raw) {this.raw = raw;}

            static public class RawToken {
                ParentKeyToken parentKey;
                String kind;
                Long id;

                public RawToken(){
                }
                public RawToken(ParentKeyToken parentKey, String kind, Long id) {
                    this.parentKey = parentKey;
                    this.kind = kind;
                    this.id=id;
                }

                public String getKind() {return kind;}
                public void setKind(String kind) {this.kind = kind;}
                public Long getId() {return id;}
                public void setId(Long id) {this.id = id;}

                public ParentKeyToken getParentKey() {
                    return parentKey;
                }

                public void setParentKey(ParentKeyToken parentKey) {
                    this.parentKey = parentKey;
                }

                static public class ParentKeyToken {

                    String kind;
                    Long id;
                    String name;

                    public ParentKeyToken(){
                    }
                    public ParentKeyToken(String kind, Long id, String name) {
                        this.kind = kind;
                        this.id = id;
                        this.name = name;

                    }

                    public String getKind() {return kind;}
                    public void setKind(String kind) {this.kind = kind;}
                    public Long getId() {return id;}
                    public void setId(Long id) {this.id = id;}
                    public String getName() {return name;}
                    public void setName(String name) {this.name = name;}
                }
            }
        }
    }
}