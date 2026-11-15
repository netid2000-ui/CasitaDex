import android.os.SystemClock;
import android.view.InputDevice;
import android.view.MotionEvent;
public class CasitaDexPinch {
 static Object manager; static java.lang.reflect.Method inject;
 static long down;
 static void send(int action,int count,float cx,float cy,float distance)throws Exception {
  MotionEvent.PointerProperties[] props=new MotionEvent.PointerProperties[count];
  MotionEvent.PointerCoords[] coords=new MotionEvent.PointerCoords[count];
  for(int i=0;i<count;i++){props[i]=new MotionEvent.PointerProperties();props[i].id=i;props[i].toolType=MotionEvent.TOOL_TYPE_FINGER;coords[i]=new MotionEvent.PointerCoords();coords[i].x=cx+(i==0?-distance:distance);coords[i].y=cy;coords[i].pressure=1;coords[i].size=1;}
  MotionEvent e=MotionEvent.obtain(down,SystemClock.uptimeMillis(),action,count,props,coords,0,0,1,1,0,0,InputDevice.SOURCE_TOUCHSCREEN,0);
  boolean ok=(Boolean)inject.invoke(manager,e,2);e.recycle();if(!ok)throw new Exception("Input event rejected");
 }
 public static void main(String[] args)throws Exception {
  Class<?> cls=Class.forName("android.hardware.input.InputManagerGlobal");
  manager=cls.getMethod("getInstance").invoke(null);
  inject=cls.getMethod("injectInputEvent",android.view.InputEvent.class,int.class);
  float cx=Float.parseFloat(args[0]),cy=Float.parseFloat(args[1]);
  down=SystemClock.uptimeMillis();send(MotionEvent.ACTION_DOWN,1,cx,cy,60);
  send(MotionEvent.ACTION_POINTER_DOWN|(1<<MotionEvent.ACTION_POINTER_INDEX_SHIFT),2,cx,cy,60);
  for(int i=1;i<=20;i++){send(MotionEvent.ACTION_MOVE,2,cx,cy,60+i*9);SystemClock.sleep(20);}
  send(MotionEvent.ACTION_POINTER_UP|(1<<MotionEvent.ACTION_POINTER_INDEX_SHIFT),2,cx,cy,240);
  send(MotionEvent.ACTION_UP,1,cx,cy,240);System.out.println("Two-pointer pinch-out injected");
 }
}
