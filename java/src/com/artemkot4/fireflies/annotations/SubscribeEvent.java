package com.artemkot4.fireflies.annotations;

/**
 * Class to declare your events into class extended from Event
 */
public @interface SubscribeEvent {
    // public String name();
    public int value() default 1;
}
