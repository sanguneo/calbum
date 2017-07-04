package com.calbum;

import android.widget.LinearLayout;
import android.graphics.Color;
import android.widget.ImageView;
import android.view.Gravity;
import android.util.TypedValue;

import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {

    @Override
    public LinearLayout createSplashLayout() {
        LinearLayout view = new LinearLayout(this);

        ImageView image = new ImageView(this);
        image.setImageResource(R.drawable.splash) ;

        view.setBackgroundColor(Color.parseColor("#36384C"));
        view.setGravity(Gravity.CENTER);

        view.addView(image);
        return view;
    }

}
