package com.calbum;

import android.support.annotation.Nullable;

import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;

import java.util.List;

import java.util.Arrays;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.sanguneo.image2merge.Image2mergePackage;
import org.pgsqlite.SQLitePluginPackage;
import com.rnfs.RNFSPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;



public class MainApplication extends NavigationApplication {

    private int currentApiVersion;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Nullable
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
            new SQLitePluginPackage(),
            new PickerPackage(),
            new Image2mergePackage(),
            new RNFSPackage(),
            new RNAdMobPackage(),
            new ImageResizerPackage()
        );
    }
}
