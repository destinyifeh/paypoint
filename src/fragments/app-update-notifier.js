import {Alert, Linking} from 'react-native';
import {
  APP_VERSION,
  ENVIRONMENT_IS_PRODUCTION,
} from '../constants/api-resources';
import {onPressAppUpdateButton} from '../services/redux/actions/tunnel';
import store from '../services/redux/store';

export const paypointAppUpdateNotifier = () => {
  try {
    const remoteChecker = store.getState().tunnel.remoteConfig;
    // console.log(remoteChecker, 'remote check');
    const store_url = remoteChecker.latest_app_url;
    const force_app_update = remoteChecker.should_force_app_updates;
    console.log(force_app_update, 'forcer');
    const isUpdateAvailable =
      remoteChecker.latest_app_version !== null &&
      remoteChecker.latest_app_version !== APP_VERSION;
    const showUpdate = isUpdateAvailable && ENVIRONMENT_IS_PRODUCTION;

    console.log(isUpdateAvailable, 'update available');
    console.log(showUpdate, 'show update');
    console.log(remoteChecker.latest_app_version, APP_VERSION, 'versions');
    console.log(ENVIRONMENT_IS_PRODUCTION, 'env...');

    const yes = false;

    if (yes) {
      Alert.alert(
        'Update Available',
        'A new version of the app is available. Update now for the latest features and improvements.',
        [
          !force_app_update
            ? {
                text: 'Remind Me Later',
                onPress: () => console.log('Remind Me Later Pressed'),
              }
            : null,
          {
            text: 'Update Now',
            onPress: () => {
              Linking.openURL(store_url);
              store.dispatch(onPressAppUpdateButton(true));
            },
          },
        ].filter(Boolean),
      );
    }
    return null;
  } catch (err) {
    console.log(err, 'app update err');
  }
};
