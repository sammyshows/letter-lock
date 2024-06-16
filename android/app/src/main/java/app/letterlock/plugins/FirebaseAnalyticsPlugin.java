package app.letterlock.plugins;

import android.os.Bundle;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;
import com.google.firebase.analytics.FirebaseAnalytics;

@CapacitorPlugin(name = "FirebaseAnalytics")
public class FirebaseAnalyticsPlugin extends Plugin {
    private FirebaseAnalytics firebaseAnalytics;

    @Override
    public void load() {
        firebaseAnalytics = FirebaseAnalytics.getInstance(getContext());
    }

    @PluginMethod
    public void logEvent(PluginCall call) {
        String name = call.getString("name");
        JSObject params = call.getObject("params");

        if (name == null) {
            call.reject("Event name must be provided");
            return;
        }

        Bundle bundle = Utils.toBundle(params);
        firebaseAnalytics.logEvent(name, bundle);

        call.resolve();
    }

    @PluginMethod
    public void setUserId(PluginCall call) {
        String userId = call.getString("userId");

        if (userId == null) {
            call.reject("User ID must be provided");
            return;
        }

        firebaseAnalytics.setUserId(userId);
        call.resolve();
    }

    @PluginMethod
    public void setUserProperty(PluginCall call) {
        String name = call.getString("name");
        String value = call.getString("value");

        if (name == null || value == null) {
            call.reject("Name and value must be provided");
            return;
        }

        firebaseAnalytics.setUserProperty(name, value);
        call.resolve();
    }
}
