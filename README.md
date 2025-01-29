# **Quickteller Paypoint Mobile App**

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Setup

> `.env.development` and `.env.production` files contain externalized project variables such as API URLs which reflect the environment (UAT or Production) the app will be bundled into. These variables could however be overwritten by toggling the `FORCE_UAT` and `FORCE_PROD` variables in `src/constants/api-resources.js`.

1. **Install Project Dependencies**: Open a terminal, navigate to the project root directory and type in the command: `npm install`.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start


```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ app:

### For Android

```bash
# using npm
npm run android


```

## Step 3: Connect your device to your development server

- Share WiFi from your device, and connect your PC to the network.
- In another terminal session, run the `ipconfig` command to retrieve your local IP address.
- Open a debuggable build of the Quickteller Paypoint app on your device.
- Shake your device to reveal the developer menu.
- Click on "Dev Settings".
- Select "Debug server host & port for device" and type your PC's local IP address retrieved in the second step, followed by `:8081`, for example: `192.168.1.2:8081`, and press "OK", and press the back button on your device to close the menu.
- Again, shake your device to reveal the developer menu.
- Click on Reload, to refresh the app and see the latest code changes.

---

## Git Branch Convention

> The `development` branch is primary. Thus, is expected to have the latest codebase at all times. This `development` branch is meant to be merge-compatible with all `release` branches; as new `feature` branches are to be created off this, and merged to this.
> Every release has it's branch which follows the naming convention: `release/<VERSION_CODE>`. Where `VERSION_CODE` corresponds to the version code as seen on Google Play and on the App Store. Each release branch should be in-sync with the corresponding release on the app stores.

With that in mind, here's a briefing on the major branches in the repo, as at time of writing:

1. `development` -- The primary branch of the repository.
1. `release/2.0.30` -- Latest binary deployed on majority of our Android users (via Google Play).
1. `release/2.0.60` -- Latest binary deployed on our Android POS devices (via the PAX Store).
1. `release/2.0.90` -- New binary currently **only rolled out to a number of internal agents**.

> Do not merge two `release` branches, unless you know exactly what you're doing.

---

## Resources

1. [Mobile App Figma Prototype](https://www.figma.com/file/UAwylb9z5RKkb7BBNZXGAp/Quickteller-MOBILE_APP-1.1)
1. [Paypoint Cashout Figma Proptotype](https://www.figma.com/file/8k2GmDWPDYmyTDkT7vlgbC/QTP-Cashout?node-id=26%3A7)
1. [Debug APK Binary](https://drive.google.com/file/d/1w4XLO3mt9vlen_9ika0MjcRlrarJNe-a/view?usp=sharing)
1. [release APK Binary](https://drive.google.com/file/d/1w4XLO3mt9vlen_9ika0MjcRlrarJNe-a/view?usp=sharing)

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
