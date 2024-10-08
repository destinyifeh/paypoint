package com.finch_agent_mobile_app;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Log;

import com.telpo.tps550.api.TelpoException;
import com.telpo.tps550.api.printer.UsbThermalPrinter;
import com.telpo.tps550.api.util.StringUtil;
import com.telpo.tps550.api.util.SystemUtil;

public class IntentHelper extends ReactContextBaseJavaModule {
  Context reactContext;

  private int leftDistance = 0;
  private int lineDistance = 33;
  private int printGray = 10;
  private int startMode = 0;

  IntentHelper(ReactApplicationContext context) {
    super(context);

    this.reactContext = context;
  }
  
  @Override
  public String getName() {
    return "IntentHelper";
  }

  @ReactMethod
  public void sendIntent(String action, String contentUri, String packageName, String mimeType) {
    Activity currentActivity = getCurrentActivity();
    Intent intent = new Intent();

    final Uri contentUri_ = Uri.parse(contentUri);
    
    intent.setAction(action);
    intent.putExtra(Intent.EXTRA_STREAM, contentUri_);
    intent.setType(mimeType);
    intent.setPackage(packageName);
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    
    currentActivity.startActivity(intent);
  }

  @ReactMethod
  public void useThermalPrinterToPrintImage(String path, Callback onErrorOccurred) {
    Bitmap bitmapData = BitmapFactory.decodeFile(path);
    UsbThermalPrinter printer = new UsbThermalPrinter(this.reactContext);

    try {
      printer.start(startMode);
      printer.setAlgin(UsbThermalPrinter.ALGIN_MIDDLE);
      printer.printLogo(bitmapData, false);
    } catch (TelpoException e) {
      e.printStackTrace();
      String Result = e.toString();

      onErrorOccurred.invoke(Result);
    } finally {
      printer.stop();
    }
  }

  @ReactMethod
  public void useThermalPrinterToWalk(int numberOfLines, Callback onErrorOccurred) {
    UsbThermalPrinter printer = new UsbThermalPrinter(this.reactContext);

    try {
      printer.start(startMode);
      printer.walkPaper(numberOfLines);
    } catch (TelpoException e){
      e.printStackTrace();
      String Result = e.toString();

      onErrorOccurred.invoke(Result);
    } finally {
      printer.stop();
    }
  }

  @ReactMethod
  public void useThermalPrinterToPrintString(String content, Boolean isBold, int wordFont, int grayLevel, Callback onErrorOccurred) {
    UsbThermalPrinter printer = new UsbThermalPrinter(this.reactContext);

    try {
      printer.start(startMode);
      printer.setAlgin(UsbThermalPrinter.ALGIN_LEFT);
      printer.setLeftIndent(leftDistance);
      printer.setBold(isBold);
      printer.setTextSize(wordFont);
      // printer.setLineSpace(lineSpace);
      printer.addString(content);
      printer.setGray(grayLevel);
      printer.printString();
      printer.clearString();
    } catch (TelpoException e) {
      e.printStackTrace();
      String Result = e.toString();

      onErrorOccurred.invoke(Result);
    } finally {
      printer.stop();
    }
  }
}