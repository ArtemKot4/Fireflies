package com.artemkot4.fireflies.events;

import java.lang.reflect.Method;

import com.artemkot4.fireflies.annotations.SubscribeEvent;
import com.zhekasmirnov.horizon.runtime.logger.Logger;

public class EventFactory {
    public static void addFromSubscribers(Class factory) {
        // for(Method method : factory.getMethods()) {
        //     if(method.isAnnotationPresent(SubscribeEvent.class)) {
        //         SubscribeEvent annotation = (SubscribeEvent) method.getAnnotation(SubscribeEvent.class);
        //         String eventName = annotation.value();
        //         if(eventName == "") {
        //             eventName = method.getName().replace("on", "");
        //         }
        //         Event.add(eventName, (args) -> {
        //             try {
        //                 method.invoke(factory, args);
        //             } catch (Exception exception) {
        //                 Logger.error("Fireflies", "Event: " + method.getName() + " throws error: " + exception.toString());
        //             }
        //         }, 0);
        //     }
        // }
    }

    public static void addFrom(Class factory) {

    }
}
