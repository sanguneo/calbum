package com.sanguneo.image2merge;

import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import android.content.ContextWrapper;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

class Image2mergeModule extends ReactContextBaseJavaModule {
    private Context context;

    public Image2mergeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @Override
    public String getName() {
        return "Image2merge";
    }
    private static int getPowerOfTwoForSampleRatio(double ratio){
        int k = Integer.highestOneBit((int)Math.floor(ratio));
        if(k==0) return 1;
        else return k;
    }
    private Bitmap getImageBitmap(Uri uri) throws FileNotFoundException, IOException{
        InputStream input = getReactApplicationContext().getContentResolver().openInputStream(uri);

        BitmapFactory.Options onlyBoundsOptions = new BitmapFactory.Options();
        onlyBoundsOptions.inJustDecodeBounds = true;
        onlyBoundsOptions.inDither=true;//optional
        onlyBoundsOptions.inPreferredConfig=Bitmap.Config.ARGB_8888;//optional
        BitmapFactory.decodeStream(input, null, onlyBoundsOptions);
        input.close();

        if ((onlyBoundsOptions.outWidth == -1) || (onlyBoundsOptions.outHeight == -1)) {
            return null;
        }

        int originalSize = (onlyBoundsOptions.outHeight > onlyBoundsOptions.outWidth) ? onlyBoundsOptions.outHeight : onlyBoundsOptions.outWidth;

        BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
        bitmapOptions.inSampleSize = getPowerOfTwoForSampleRatio(1.0);
        bitmapOptions.inDither = true;
        bitmapOptions.inPreferredConfig=Bitmap.Config.ARGB_8888;//
        input = getReactApplicationContext().getContentResolver().openInputStream(uri);
        Bitmap bitmap = BitmapFactory.decodeStream(input, null, bitmapOptions);
        input.close();
        return bitmap;
    }

    private Bitmap resizeBitmap(Bitmap src, int max) {
        if(src == null)
            return null;

        int width = src.getWidth();
        int height = src.getHeight();
        float rate = 0.0f;

        if (width > height) {
            rate = max / (float) width;
            height = (int) (height * rate);
            width = max;
        } else {
            rate = max / (float) height;
            width = (int) (width * rate);
            height = max;
        }

        return Bitmap.createScaledBitmap(src, width, height, true);
    }

    private String saveBitmapToJpg(Bitmap bitmap, String folder, String name) {
        String dir_path =Environment.getExternalStorageDirectory().getAbsolutePath() + "/"+folder+"/";
        File directory = null;
        File file = null;
        try {
            directory = new File(dir_path);
            if (!directory.exists()) {
                directory.mkdir();
            }
            OutputStream fOutputStream = null;
            file = new File(directory, name + ".jpg");
            fOutputStream = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fOutputStream);
            fOutputStream.flush();
            fOutputStream.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Uri.fromFile(file).toString();
    }

    private Bitmap _mergeMultiple(Bitmap[] parts){
        Bitmap result = Bitmap.createBitmap(parts[0].getWidth() * 2, parts[0].getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint();
        canvas.drawBitmap(parts[0], 0, 0, paint);
        canvas.drawBitmap(parts[1], parts[0].getWidth(), 0, paint);
        return result;
    }

    public String _image2merge(Uri[] twoParts, String imgName) throws FileNotFoundException, IOException {
        Bitmap[] bitmaps = new Bitmap[] {
                getImageBitmap(twoParts[0]),
                getImageBitmap(twoParts[1])
        };
        Bitmap original = _mergeMultiple(bitmaps);
        Bitmap thumbnail = resizeBitmap(original, 50);
        String originalUri = saveBitmapToJpg(original, "_original_", imgName);
        saveBitmapToJpg(thumbnail, "_thumb_", imgName);
        String merged = originalUri.replaceAll("_original_", "_type_");
        return merged;
    }

    @ReactMethod
    public void image2merge(ReadableArray twoParts, String imgName, Callback callback) throws FileNotFoundException, IOException {
        Uri[] partsUri = new Uri[] {
                Uri.parse(twoParts.getString(0)),
                Uri.parse(twoParts.getString(1))
        };
        String ret = _image2merge(partsUri, imgName);
        callback.invoke(ret);
    }
}
