
package com.mycrewchallenge;

import android.app.AlertDialog;
import android.content.DialogInterface;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNTAlert extends ReactContextBaseJavaModule {
  private ReactApplicationContext context;

  public RNTAlert(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;
  }

  @Override
  public String getName() {
    return "RNTAlert";
  }

  @ReactMethod
  public void showAlert() {
    AlertDialog.Builder builder = new AlertDialog.Builder(context.getCurrentActivity());
    builder.setMessage("You have been logged out");

    builder.setNeutralButton(
        "Ok",
        new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.cancel();
            }
        });

    AlertDialog alert = builder.create();
    alert.show();
  }
}