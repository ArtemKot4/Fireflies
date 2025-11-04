package com.artemkot4.fireflies.item;

import com.zhekasmirnov.innercore.api.unlimited.IDRegistry;

public class Item {
    public final String stringID;
    public final int id;

    public Item(String stringID) {
        this.stringID = stringID;
        this.id = IDRegistry.genItemID(stringID);
    }
}
