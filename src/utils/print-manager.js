import {NativeModules} from 'react-native';

import FileProvider from 'react-native-file-provider';
import RNFS from 'react-native-fs';
import SendIntentAndroid from 'react-native-send-intent';

import {
  APP_LOGO_ASSET_PATH,
  DEVICES_WITH_PRINTERS,
  PRINTER_DRIVER_PACKAGE_NAME,
} from '../constants/api-resources';
import {BLOCKER} from '../constants/dialog-priorities';
import {formatReceiptFieldsAsString} from '../serializers/resources/receipt';
import {getDeviceDetails} from './device';
import {flashMessage} from './dialog';

const {IntentHelper, TelpoPrinterHelper, PaxPrinterHelper} = NativeModules;

export default class PrintManager {
  constructor({devicesWithPrinters = DEVICES_WITH_PRINTERS}) {
    this.devicesWithPrinters = devicesWithPrinters;
  }

  async checkIfDeviceHasInbuiltPrinter() {
    const {deviceModel} = await getDeviceDetails();
    return this.devicesWithPrinters.includes(deviceModel);
  }

  async checkIfUserCanPrint() {
    return (
      (await this.checkIfDeviceHasInbuiltPrinter()) ||
      (await SendIntentAndroid.isAppInstalled(PRINTER_DRIVER_PACKAGE_NAME))
    );
  }

  async printReceipt(uri, billerLogo = null) {
    const manager = (await this.checkIfDeviceHasInbuiltPrinter())
      ? new InbuiltUsbThermalPrintManager()
      : new BluetoothPrintManager();

    return manager.printReceipt(uri, billerLogo);
  }
}

export class BluetoothPrintManager {
  async printReceipt(uri, billerLogo) {
    IntentHelper.sendIntent(
      'android.intent.action.SEND',
      await FileProvider.getUriForFile(
        'com.finch_agent_mobile_app_pax.provider',
        uri,
      ),
      PRINTER_DRIVER_PACKAGE_NAME,
      'image/jpg',
    );
  }
}

export class InbuiltUsbThermalPrintManager {
  errorCallback(error) {
    flashMessage('Printer Error', error, BLOCKER);
  }

  async printReceipt(fields, billerLogo) {
    let content;
    let fontSize;
    let grayLevel;
    let isBold;
    let numberOfLinesToWalk;

    const appLogoDestinationPath = RNFS.DocumentDirectoryPath + '/logo.png';

    billerLogo
      ? TelpoPrinterHelper.printImage(billerLogo, 160, 160, this.errorCallback)
      : TelpoPrinterHelper.printImage(
          appLogoDestinationPath,
          136,
          384,
          this.errorCallback,
        );

    numberOfLinesToWalk = 5;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);

    (await RNFS.exists(appLogoDestinationPath))
      ? null
      : await RNFS.copyFileAssets(APP_LOGO_ASSET_PATH, appLogoDestinationPath);

    // \nHere is your transaction receipt.\nSee payment details below.
    content = 'Here is your transaction receipt.\nSee payment details below.';
    fontSize = 18;
    grayLevel = 5;
    isBold = false;
    isCenter = false;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    content = '\nPayment Details';
    fontSize = 27;
    grayLevel = 7;
    isBold = true;
    isCenter = false;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    numberOfLinesToWalk = 2;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);

    content = formatReceiptFieldsAsString(fields);
    fontSize = 20;
    grayLevel = 5;
    isBold = false;
    isCenter = false;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    numberOfLinesToWalk = 10;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);

    numberOfLinesToWalk = 2;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);

    billerLogo &&
      TelpoPrinterHelper.printImage(
        appLogoDestinationPath,
        136,
        384,
        this.errorCallback,
      );

    content = 'Thank you for using Quickteller Paypoint';
    fontSize = 24;
    grayLevel = 7;
    isBold = true;
    isCenter = true;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    numberOfLinesToWalk = 10;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);
  }

  async printReceiptPax(fields, billerLogo) {
    let content;
    let fontSize;
    let grayLevel;
    let isBold;
    let numberOfLinesToWalk;

    const appLogoDestinationPath = RNFS.DocumentDirectoryPath + '/logo.png';

    flashMessage('printReceiptPax: ', {fields}, BLOCKER);
    flashMessage('billerLogo: ', JSON.stringify(billerLogo), BLOCKER);
    flashMessage(
      'appLogoDestinationPath: ',
      JSON.stringify(appLogoDestinationPath),
      BLOCKER,
    );
    billerLogo
      ? PaxPrinterHelper.printBitmap(billerLogo, 160, 160, this.errorCallback)
      : PaxPrinterHelper.printBitmap(
          appLogoDestinationPath,
          136,
          384,
          this.errorCallback,
        );

    (await RNFS.exists(appLogoDestinationPath))
      ? null
      : await RNFS.copyFileAssets(APP_LOGO_ASSET_PATH, appLogoDestinationPath);

    // \nHere is your transaction receipt.\nSee payment details below.
    content = 'Here is your transaction receipt.\nSee payment details below.';
    fontSize = 18;
    grayLevel = 5;
    isBold = false;
    isCenter = false;
    PaxPrinterHelper.printStr(content, '');

    content = '\nPayment Details';
    PaxPrinterHelper.printStr(content, '');

    content = formatReceiptFieldsAsString(fields);
    fontSize = 20;
    grayLevel = 5;
    isBold = false;
    isCenter = false;
    PaxPrinterHelper.printStr(content, '');

    billerLogo &&
      PaxPrinterHelper.printBitmap(
        appLogoDestinationPath,
        136,
        384,
        this.errorCallback,
      );

    content = 'Thank you for using Quickteller Paypoint';
    fontSize = 24;
    grayLevel = 7;
    isBold = true;
    isCenter = true;
    PaxPrinterHelper.printStr(content, '');
  }

  async printBitmap(fields, billerLogo) {
    let content;
    let fontSize;
    let grayLevel;
    let isBold;
    let numberOfLinesToWalk;

    const appLogoDestinationPath = RNFS.DocumentDirectoryPath + '/logo.png';

    billerLogo
      ? PaxPrinterHelper.printBitmap(billerLogo, 160, 160, this.errorCallback)
      : PaxPrinterHelper.printBitmap(
          appLogoDestinationPath,
          136,
          384,
          this.errorCallback,
        );

    (await RNFS.exists(appLogoDestinationPath))
      ? null
      : await RNFS.copyFileAssets(APP_LOGO_ASSET_PATH, appLogoDestinationPath);

    // \nHere is your transaction receipt.\nSee payment details below.
    content = 'Here is your transaction receipt.\nSee payment details below.';
    fontSize = 18;
    grayLevel = 5;
    isBold = false;
    isCenter = false;
    PaxPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    content = '\nPayment Details';
    fontSize = 27;
    grayLevel = 7;
    isBold = true;
    isCenter = false;
    PaxPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    content = formatReceiptFieldsAsString(fields);
    fontSize = 20;
    grayLevel = 5;
    isBold = false;
    isCenter = false;
    PaxPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    billerLogo &&
      TelpoPrinterHelper.printImage(
        appLogoDestinationPath,
        136,
        384,
        this.errorCallback,
      );

    content = 'Thank you for using Quickteller Paypoint';
    fontSize = 24;
    grayLevel = 7;
    isBold = true;
    isCenter = true;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );
    /*
    numberOfLinesToWalk = 10;
    TelpoPrinterHelper.walk(
        numberOfLinesToWalk,
        this.errorCallback,
    );*/
  }

  async printStr(content, cutMode) {
    flashMessage(`Content ${content}`);
    PaxPrinterHelper.printStr(content, '');
  }

  async testPrint() {
    try {
      const printers = await EscPosPrinter.discovery();

      const printer = printers[0];

      await EscPosPrinter.init({
        target: printer.target,
        seriesName: getPrinterSeriesByName(printer.name),
        language: 'EPOS2_LANG_EN',
      });

      const printing = new EscPosPrinter.printing();

      const status = await printing
        .initialize()
        .align('center')
        .size(3, 3)
        .line('DUDE!')
        .smooth()
        .line('DUDE!')
        .smooth()
        .size(1, 1)
        .text('is that a ')
        .bold()
        .underline()
        .text('printer?')
        .bold()
        .underline()
        .newline(2)
        .align('center')
        .image(image, 200)
        .barcode({
          value: 'Test123',
          type: 'EPOS2_BARCODE_CODE93',
          hri: 'EPOS2_HRI_BELOW',
          width: 2,
          height: 50,
        })
        .qrcode({
          value: 'Test123',
          level: 'EPOS2_LEVEL_M',
          width: 5,
        })
        .cut()
        .send();
    } catch (e) {
      console.log('Error:', status);
    }
  }
}
