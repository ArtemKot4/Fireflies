package com.artemkot4.fireflies.loader;

// import com.zhekasmirnov.innercore.api.NativeBlock;
// import com.zhekasmirnov.innercore.api.NativeItem;
// import com.zhekasmirnov.innercore.api.mod.util.ScriptableFunctionImpl;
// import com.zhekasmirnov.innercore.api.runtime.Callback;
// import com.zhekasmirnov.innercore.api.unlimited.IDRegistry;
// import org.mozilla.javascript.Context;
// import org.mozilla.javascript.Scriptable;

// import java.lang.reflect.Method;
// import java.util.ArrayList;

// public class Registrate {
//     public static ArrayList<Block> blocks = new ArrayList<>();
//     public static ArrayList<Item> items = new ArrayList<>();

//     public static void addEvents(Class<?> eventListener) {
//         for(Method method : eventListener.getClass().getMethods()) {
//             if(method.isAnnotationPresent(SubscribeEvent.class)) {
//                 String methodName = method.getName();

//                 Callback.addCallback(methodName.startsWith("on") ? methodName.substring(2) : methodName, new ScriptableFunctionImpl() {
//                     @Override
//                     public Object call(Context context, Scriptable scriptable, Scriptable scriptable1, Object[] objects) {
//                         try {
//                             method.invoke(eventListener, objects);
//                         } catch (Exception e) {
//                             throw new RuntimeException(e);
//                         }
//                         return this;
//                     }
//                 }, method.getAnnotation(SubscribeEvent.class).value());
//             }
//         }
//     }

//     public final String MODID;
//     public Registrate(String MODID) {
//         this.MODID = MODID;
//     }

//     public Block addBlock(Block block) {
//         String id = MODID + ":" + block.getStringID();
//         NativeBlock.createBlock(IDRegistry.genBlockID(id),  id,"aboba", 0);

//         return block;
//     }

//     public Item addItem(Item item) {
//         NativeItem.createItem()
//         return item;
//     }

// }
