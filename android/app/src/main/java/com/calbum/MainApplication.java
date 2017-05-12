package com.calbum;

import android.support.annotation.Nullable;

import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;

import java.util.List;

/*
// in case soft button hide enable
import com.reactnativenavigation.controllers.ActivityCallbacks;
import android.view.View;
import android.os.Build;
import android.os.Bundle;
import android.app.Activity;
*/
import java.util.Arrays;
import com.rnfs.RNFSPackage;
import com.imagepicker.ImagePickerPackage;

public class MainApplication extends NavigationApplication {

/*
// in case soft button hide enable

    private int currentApiVersion;

    @Override
    public void onCreate() {
        currentApiVersion = Build.VERSION.SDK_INT;
        super.onCreate();
        setActivityCallbacks(new ActivityCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
                final int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
                if(currentApiVersion >= Build.VERSION_CODES.KITKAT) {
                    activity.getWindow().getDecorView().setSystemUiVisibility(flags);
                    final View decorView = activity.getWindow().getDecorView();
                    decorView.setOnSystemUiVisibilityChangeListener(new View.OnSystemUiVisibilityChangeListener(){
                        @Override
                        public void onSystemUiVisibilityChange(int visibility) {
                            if((visibility & View.SYSTEM_UI_FLAG_FULLSCREEN) == 0) {
                                decorView.setSystemUiVisibility(flags);
                            }
                        }
                    });
                }
            }
            public void onActivityWindowFocusChanged(Activity activity, boolean hasFocus) {
                if(currentApiVersion >= Build.VERSION_CODES.KITKAT && hasFocus) {
                    activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
                }
            }
        });
    }
*/

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Nullable
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
            new RNFSPackage(),
            new ImagePickerPackage()
        );
    }
}
