package app.letterlock;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import app.letterlock.plugins.FirebaseAnalyticsPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register the plugins
        registerPlugin(FirebaseAnalyticsPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
