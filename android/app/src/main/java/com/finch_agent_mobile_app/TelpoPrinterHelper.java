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


public class TelpoPrinterHelper extends ReactContextBaseJavaModule {
  Context reactContext;

  private int leftDistance = 0;
  private int lineDistance = 33;
  private int printGray = 10;
  private int startMode = 0;

  TelpoPrinterHelper(ReactApplicationContext context) {
    super(context);

    this.reactContext = context;
  }
  
  @Override
  public String getName() {
    return "TelpoPrinterHelper";
  }

  private static Bitmap resizeImage(Bitmap image, int newWidth, int newHeight) {
    // String mode, boolean onlyScaleDown) {
    Bitmap newImage = null;
    if (image == null) {
      return null;
    }

    try {
      newImage = Bitmap.createScaledBitmap(image, newWidth, newHeight, true);
    } catch (OutOfMemoryError e) {
      return null;
    }

    return newImage;
  }

  @ReactMethod
  public void printImage(String path, int height, int width, Callback onErrorOccurred) {
    Bitmap bitmapData = BitmapFactory.decodeFile(path);
    bitmapData = TelpoPrinterHelper.resizeImage(bitmapData, width, height);
    UsbThermalPrinter printer = new UsbThermalPrinter(this.reactContext);

    try {
      printer.start(startMode);
      printer.setAlgin(UsbThermalPrinter.ALGIN_MIDDLE);
      printer.printLogo(bitmapData, false);
    } catch (TelpoException e) {
      e.printStackTrace();
      String Result = e.toString();

      Log.d("Error using thermal printer to print: ", Result);

      onErrorOccurred.invoke(Result);
    } finally {
      printer.stop();
    }
  }

  @ReactMethod
  public void walk(int numberOfLines, Callback onErrorOccurred) {
    UsbThermalPrinter printer = new UsbThermalPrinter(this.reactContext);

    try {
      printer.start(startMode);
      printer.walkPaper(numberOfLines);
    } catch (TelpoException e){
      e.printStackTrace();
      String Result = e.toString();

      Log.d("Error using thermal printer to print: ", Result);

      onErrorOccurred.invoke(Result);
    } finally {
      printer.stop();
    }
  }

  @ReactMethod
  public void printString(
    String content, Boolean isBold, Boolean isCenter, int wordFont, int grayLevel, 
    Callback onErrorOccurred
  ) {
    UsbThermalPrinter printer = new UsbThermalPrinter(this.reactContext);

    try {
      printer.start(startMode);
      printer.setAlgin(UsbThermalPrinter.ALGIN_LEFT);

      if (isCenter) printer.setAlgin(UsbThermalPrinter.ALGIN_MIDDLE);

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

      Log.d("Error using thermal printer to print: ", Result);

      onErrorOccurred.invoke(Result);
    } finally {
      printer.stop();
    }
  }
}