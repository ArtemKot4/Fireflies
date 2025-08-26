package com.artemkot4.fireflies;

import java.util.HashMap;
import com.artemkot4.fireflies.events.Event;

public class Fireflies {
    public static void boot(HashMap<?, ?> args) {
        Event.init();
    }
}
