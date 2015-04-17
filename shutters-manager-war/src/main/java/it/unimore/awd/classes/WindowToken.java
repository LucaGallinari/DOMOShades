package it.unimore.awd.classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;

public class WindowToken {
    RoomToken room;
    Long windowId;
    List<Rules> rulesLists;

    public WindowToken(){
    }

    public WindowToken(RoomToken room, Long windowId, List<Rules> rulesLists) {
        super();
        this.room = room;
        this.windowId = windowId;
        this.rulesLists = rulesLists;
    }

    public RoomToken getRoom() { return room; }
    public void setRoom(RoomToken room) { this.room = room; }
    public Long getWindowId() { return windowId; }
    public void setWindowId(Long windowId) { this.windowId = windowId; }
    public List<Rules> getRulesLists() { return rulesLists; }
    public void setRulesLists(List<Rules> rulesLists) { this.rulesLists = rulesLists; }

    @Override public String toString(){
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }

    static public class RoomToken {
        KeyToken key;

        public RoomToken() {
        }
        public RoomToken(KeyToken key) {
            this.key = key;
        }

        public static class KeyToken {
            RawToken raw;

            public KeyToken() {
            }
            public KeyToken(RawToken raw) {
                this.raw = raw;
            }

            static public class RawToken {

                ParentKeyToken parentKey;
                String kind;
                Long id;

                public RawToken(){
                }
                public RawToken(String kind, Long id, ParentKeyToken parentKey) {
                    this.kind = kind;
                    this.id = id;
                    this.parentKey = parentKey;
                }

                static public class ParentKeyToken {

                    ParentKeyToken2 parentKey;
                    String kind;
                    Long id;

                    public ParentKeyToken(){
                    }
                    public ParentKeyToken(String kind, Long id, ParentKeyToken2 parentKey) {
                        this.kind = kind;
                        this.id = id;
                        this.parentKey = parentKey;
                    }

                    static public class ParentKeyToken2 {

                        ParentKeyNameToken parentKey;
                        String kind;
                        Long id;

                        public ParentKeyToken2(){
                        }
                        public ParentKeyToken2(String kind, Long id, ParentKeyNameToken parentKey) {
                            this.kind = kind;
                            this.id = id;
                            this.parentKey = parentKey;
                        }

                        static public class ParentKeyNameToken {

                            ParentKeyToken parentKey;
                            String kind;
                            Long id;

                            public ParentKeyNameToken(){
                            }
                            public ParentKeyNameToken(String kind, Long id, ParentKeyToken parentKey) {
                                this.kind = kind;
                                this.id = id;
                                this.parentKey = parentKey;
                            }

                            public ParentKeyToken getParentKey() { return parentKey; }
                            public void setParentKey(ParentKeyToken parentKey) { this.parentKey = parentKey; }
                            public String getKind() {return kind;}
                            public void setKind(String kind) {this.kind = kind;}
                            public Long getId() {return id;}
                            public void setId(Long id) {this.id = id;}
                        }

                        public ParentKeyNameToken getParentKey() { return parentKey; }
                        public void setParentKey(ParentKeyNameToken parentKey) { this.parentKey = parentKey; }
                        public String getKind() {return kind;}
                        public void setKind(String kind) {this.kind = kind;}
                        public Long getId() {return id;}
                        public void setId(Long id) {this.id = id;}
                    }

                    public ParentKeyToken2 getParentKey() { return parentKey; }
                    public void setParentKey(ParentKeyToken2 parentKey) { this.parentKey = parentKey; }
                    public String getKind() {return kind;}
                    public void setKind(String kind) {this.kind = kind;}
                    public Long getId() {return id;}
                    public void setId(Long id) {this.id = id;}
                }

                public ParentKeyToken getParentKey() { return parentKey; }
                public void setParentKey(ParentKeyToken parentKey) { this.parentKey = parentKey; }
                public String getKind() {return kind;}
                public void setKind(String kind) {this.kind = kind;}
                public Long getId() {return id;}
                public void setId(Long id) {this.id = id;}
            }

            public RawToken getRaw() { return raw; }
            public void setRaw(RawToken raw) { this.raw = raw; }
        }

        public KeyToken getKey() { return key; }
        public void setKey(KeyToken key) { this.key = key; }
    }

}
