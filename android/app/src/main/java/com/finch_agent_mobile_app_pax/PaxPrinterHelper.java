package com.finch_agent_mobile_app_pax;

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

import android.util.Pair;

import com.pax.dal.IPrinter;
import com.pax.dal.IDAL;
import com.pax.dal.entity.EFontTypeAscii;
import com.pax.dal.entity.EFontTypeExtCode;
import com.pax.dal.exceptions.PrinterDevException;
import com.pax.neptunelite.api.NeptuneLiteUser;

import java.io.FileNotFoundException;
import java.io.InputStream;

public class PaxPrinterHelper extends ReactContextBaseJavaModule {
  Context reactContext;

  private int leftDistance = 0;
  private int lineDistance = 33;
  private int printGray = 10;
  private int startMode = 0;

  final static int PRINT_STATUS_OK = 0;
  private IPrinter printer;
  private IDAL dal;

  public PaxPrinterHelper(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;

    try {
        dal = NeptuneLiteUser.getInstance().getDal(reactContext);
        printer = dal.getPrinter();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
  
  @Override
  public String getName() {
    return "PaxPrinterHelper";
  }

  public void init() {
      try {
          printer.init();

          logTrue("init");
      } catch (PrinterDevException e) {
          e.printStackTrace();
          logErr("init", e.toString());
      }
  }

  void logTrue(String m) {
      Log.d("CardEx", m);
  }

  void logErr(String e, String s) {

      logTrue(e + " " + s);
  }

  public Pair<Integer, String> getStatus() {
      try {
          int status = printer.getStatus();
          logTrue("getStatus");
          return statusCode2Str(status);
      } catch (PrinterDevException e) {
          e.printStackTrace();
          logErr("getStatus", e.toString());
          return new Pair<>(0x0F, e.getMessage());
      }

  }

  public void fontSet(EFontTypeAscii asciiFontType, EFontTypeExtCode cFontType) {
      try {
          printer.fontSet(asciiFontType, cFontType);
          logTrue("fontSet");
      } catch (PrinterDevException e) {
          e.printStackTrace();
          logErr("fontSet", e.toString());
      }

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
  public void printBitmap(String path, int height, int width, Callback onErrorOccurred) {
    try {
        Uri uri=Uri.parse(path);
      
        InputStream imageStream = reactContext.getContentResolver().openInputStream(uri);

        Bitmap bitmapData = BitmapFactory.decodeStream(imageStream);
        //Bitmap bitmapData = BitmapFactory.decodeFile(path);
        //bitmapData = PaxPrinterHelper.resizeImage(bitmapData, width, height);
        printer.init();
        printer.setGray(3);
        printer.printBitmap(bitmapData);
        printer.start();
        logTrue("printBitmap");
    } catch (PrinterDevException | FileNotFoundException e) {
        e.printStackTrace();
        logErr("printBitmap", e.toString());
    }

  }

  @ReactMethod
  public void printStr(String text, String cutMode) {
      try {
          printer.init();
          printer.setGray(3);
          printer.printStr(text, null);
          printer.start();
          printer.cutPaper(4);
      } catch (Exception e) {
          e.printStackTrace();
      }
  }
  public Pair<Integer, String> start() {
    try {
        int res = printer.start();
        logTrue("start");
        return statusCode2Str(res);
    } catch (PrinterDevException e) {
        e.printStackTrace();
        logErr("start", e.toString());
        return new Pair<>(0x0F, e.getMessage());
    }

}

public void leftIndents(short indent) {
    try {
        printer.leftIndent(indent);
        logTrue("leftIndent");
    } catch (PrinterDevException e) {
        e.printStackTrace();
        logErr("leftIndent", e.toString());
    }
}

public int getDotLine() {
    try {
        int dotLine = printer.getDotLine();
        logTrue("getDotLine");
        return dotLine;
    } catch (PrinterDevException e) {
        e.printStackTrace();
        logErr("getDotLine", e.toString());
        return -2;
    }
}

public void setGray(int level) {
    try {
        printer.setGray(level);
        logTrue("setGray");
    } catch (PrinterDevException e) {
        e.printStackTrace();
        logErr("setGray", e.toString());
    }

}

public void setDoubleWidth(boolean isAscDouble, boolean isLocalDouble) {
    try {
        printer.doubleWidth(isAscDouble, isLocalDouble);
        logTrue("doubleWidth");
    } catch (PrinterDevException e) {
        e.printStackTrace();
        logErr("doubleWidth", e.toString());
    }
}

public void setDoubleHeight(boolean isAscDouble, boolean isLocalDouble) {
    try {
        printer.doubleHeight(isAscDouble, isLocalDouble);
        logTrue("doubleHeight");
    } catch (PrinterDevException e) {
        e.printStackTrace();
        logErr("doubleHeight", e.toString());
    }

}

public void setInvert(boolean isInvert) {
    try {
        printer.invert(isInvert);
        logTrue("setInvert");
    } catch (PrinterDevException e) {
        e.printStackTrace();
        logErr("setInvert", e.toString());
    }

}

public String cutPaper(int mode) {
    try {
        printer.cutPaper(mode);
        logTrue("cutPaper");
        return "cut paper successful";
    } catch (PrinterDevException e) {
        e.printStackTrace();
        logErr("cutPaper", e.toString());
        return e.toString();
    }
}

public Pair<Integer, String> statusCode2Str(int status) {
    String res = "";
    switch (status) {
        case PRINT_STATUS_OK:
            res = "Success ";
            break;
        case 1:
            res = "DevicePrinterImpl is busy ";
            break;
        case 2:
            res = "Out of paper ";
            break;
        case 3:
            res = "The format of print data packet error ";
            break;
        case 4:
            res = "DevicePrinterImpl malfunctions ";
            break;
        case 8:
            res = "DevicePrinterImpl over heats ";
            break;
        case 9:
            res = "DevicePrinterImpl voltage is too low";
            break;
        case 240:
            res = "Printing is unfinished ";
            break;
        case 252:
            res = " The printer has not installed font library ";
            break;
        case 254:
            res = "Data package is too long ";
            break;
        default:
            break;
    }

    logTrue(res);
    return new Pair<>(status,res);
}


  @ReactMethod 
  public void spaceSet(byte wordSpace, byte lineSpace) {
      try {
          printer.spaceSet(wordSpace, lineSpace);
          logTrue("spaceSet");
      } catch (PrinterDevException e) {
          e.printStackTrace();
          logErr("spaceSet", e.toString());
      }
  }

}