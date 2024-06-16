package app.letterlock.plugins;

import android.os.Bundle;
import com.getcapacitor.JSObject;

import java.util.Iterator;

public class Utils {
    public static Bundle toBundle(JSObject jsObject) {
        Bundle bundle = new Bundle();
        Iterator<String> keys = jsObject.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            try {
                Object value = jsObject.get(key);
                if (value instanceof String) {
                    bundle.putString(key, (String) value);
                } else if (value instanceof Integer) {
                    bundle.putInt(key, (Integer) value);
                } else if (value instanceof Boolean) {
                    bundle.putBoolean(key, (Boolean) value);
                } else if (value instanceof Double) {
                    bundle.putDouble(key, (Double) value);
                }
                // Add other types as needed
            } catch (org.json.JSONException e) {
                e.printStackTrace();
            }
        }
        return bundle;
    }
}
